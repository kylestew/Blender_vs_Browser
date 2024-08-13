import bpy
import bmesh

from http.server import BaseHTTPRequestHandler, HTTPServer
import threading

HOST_NAME = "localhost"
PORT_NUMBER = 8080


# Function to execute code on the main thread
def execute_on_main_thread(code):
    try:
        exec(code, {"bpy": bpy, "bmesh": bmesh})
        response = "Code executed successfully"
    except Exception as e:
        response = str(e)
    return response


class BlenderRequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        post_data = self.rfile.read(content_length)
        code = post_data.decode("utf-8")

        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        try:
            response = bpy.app.timers.register(
                lambda: execute_on_main_thread(code), first_interval=0
            )

            self.wfile.write(bytes("Code executed successfully", "utf-8"))
        except Exception as e:
            self.wfile.write(bytes(f"Error: {str(e)}", "utf-8"))


def start_server():
    server = HTTPServer((HOST_NAME, PORT_NUMBER), BlenderRequestHandler)
    print(f"Server started at http://{HOST_NAME}:{PORT_NUMBER}")
    server.serve_forever()


thread = threading.Thread(target=start_server)
thread.daemon = True
thread.start()
