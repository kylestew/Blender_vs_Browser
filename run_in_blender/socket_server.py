import bpy
import socket
import threading

# Define the server host and port
HOST = "127.0.0.1"  # Localhost
PORT = 65432  # Port to listen on


# Function to execute code on the main thread
def execute_on_main_thread(code):
    try:
        exec(code, {"bpy": bpy})
        response = "Code executed successfully"
    except Exception as e:
        response = str(e)
    return response


def handle_client(client_socket):
    with client_socket as sock:
        while True:
            # Receive the data from the socket
            data = sock.recv(1024).decode("utf-8")
            if not data:
                break
            try:
                # Schedule the execution on the main thread
                response = bpy.app.timers.register(
                    lambda: execute_on_main_thread(data), first_interval=0
                )
            except Exception as e:
                response = str(e)
            # Send a response back to the client
            sock.sendall(response.encode("utf-8"))


def start_server():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.bind((HOST, PORT))
        server.listen()
        print(f"Server listening on {HOST}:{PORT}")
        while True:
            client_socket, addr = server.accept()
            print(f"Connected by {addr}")
            client_handler = threading.Thread(
                target=handle_client, args=(client_socket,)
            )
            client_handler.start()


# Run the server in a background thread
server_thread = threading.Thread(target=start_server)
server_thread.daemon = True
server_thread.start()
