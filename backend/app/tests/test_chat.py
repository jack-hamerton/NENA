
from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_chat_websocket_multi_room():
    room_a = "roomA"
    room_b = "roomB"
    user_x = "userX"
    user_y = "userY"
    user_z = "userZ"

    with client.websocket_connect(f"/ws/chat/{room_a}/{user_x}") as ws_x:
        # user_x joins room_a
        msg = ws_x.receive_text()
        assert msg == f"User {user_x} has joined the chat"

        with client.websocket_connect(f"/ws/chat/{room_a}/{user_y}") as ws_y:
            # user_y joins room_a, gets their own join message
            msg = ws_y.receive_text()
            assert msg == f"User {user_y} has joined the chat"
            
            # user_x should get notification that user_y joined
            msg_for_x = ws_x.receive_text()
            assert msg_for_x == f"User {user_y} has joined the chat"

            with client.websocket_connect(f"/ws/chat/{room_b}/{user_z}") as ws_z:
                # user_z joins room_b
                msg = ws_z.receive_text()
                assert msg == f"User {user_z} has joined the chat"

                # user_x sends a message in room_a
                ws_x.send_text("Hello from room A")

                # user_x and user_y should receive it
                msg_for_x = ws_x.receive_text()
                assert msg_for_x == f"User {user_x}: Hello from room A"
                msg_for_y = ws_y.receive_text()
                assert msg_for_y == f"User {user_x}: Hello from room A"

                # user_z sends a message in room_b
                ws_z.send_text("Hello from room B")
                msg_for_z = ws_z.receive_text()
                assert msg_for_z == f"User {user_z}: Hello from room B"
                
    # Test disconnect message
    room_c = "roomC"
    user_p = "userP"
    user_q = "userQ"

    with client.websocket_connect(f"/ws/chat/{room_c}/{user_p}") as ws_p:
        # p joins
        ws_p.receive_text()
        with client.websocket_connect(f"/ws/chat/{room_c}/{user_q}") as ws_q:
            # q joins, p gets notification
            ws_q.receive_text()
            ws_p.receive_text()
            
            # q sends a message
            ws_q.send_text("Hi")
            ws_q.receive_text()
            ws_p.receive_text()

        # ws_q disconnects when the `with` block exits.
        # ws_p should receive a "left the chat" message.
        msg_for_p = ws_p.receive_text()
        assert msg_for_p == f"User {user_q} has left the chat"

