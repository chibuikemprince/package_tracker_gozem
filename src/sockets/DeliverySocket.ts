import { Server } from "socket.io";
import Delivery from "../models/Delivery";

export const setupDeliverySocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on(
      "location_changed",
      async (data: {
        delivery_id: string;
        location: { lat: number; lng: number };
      }) => {
        console.log({ data, action: "location changed" });
        const { delivery_id, location } = data;
        const updatedDelivery = await Delivery.findOneAndUpdate(
          { _id: delivery_id },
          { location },
          { new: true }
        );
        console.log({ updatedDelivery });
        if (updatedDelivery) {
          io.emit("location_changed", {
            event: "location_changed",
            delivery_object: updatedDelivery,
          });
        }
      }
    );

    socket.on(
      "status_changed",
      async (data: { delivery_id: string; status: string }) => {
        const { delivery_id, status } = data;
        console.log({ data, action: "status changed" });

        const updateData: any = { status };
        io.emit("status_changed", {
          event: "status_changed",
          delivery_id,
          status,
        });
      }
    );

    socket.on(
      "delivery_updated",
      async (data: { delivery_id: string; status: string }) => {
        console.log({ data, action: "delivery changed" });

        const { delivery_id, status } = data;
        const updateData: any = { status };

        io.emit("delivery_updated", {
          event: "delivery_updated",
          delivery_id,
          status,
        });
      }
    );

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
