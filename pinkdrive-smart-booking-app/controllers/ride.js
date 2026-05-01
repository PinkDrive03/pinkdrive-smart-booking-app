import prisma from "../config/connect.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import {
  calculateDistance,
  calculateFare,
  generateOTP,
} from "../utils/mapUtils.js";

// Helper: populate customer & rider vào ride object
const populateRide = async (rideId) => {
  return prisma.ride.findUnique({
    where: { id: rideId },
    include: { customer: true, rider: true },
  });
};

export const createRide = async (req, res) => {
  const { vehicle, pickup, drop } = req.body;

  if (!vehicle || !pickup || !drop) {
    throw new BadRequestError("Vehicle, pickup, and drop details are required");
  }

  const { address: pickupAddress, latitude: pickupLat, longitude: pickupLon } = pickup;
  const { address: dropAddress, latitude: dropLat, longitude: dropLon } = drop;

  if (!pickupAddress || !pickupLat || !pickupLon || !dropAddress || !dropLat || !dropLon) {
    throw new BadRequestError("Complete pickup and drop details are required");
  }

  const distance = state.realDistanceKm || calculateDistance(pickupLat, pickupLon, dropLat, dropLon);
  const fare = calculateFare(distance);

  const ride = await prisma.ride.create({
    data: {
      vehicle,
      distance,
      fare: fare[vehicle],
      pickupAddress,
      pickupLatitude: pickupLat,
      pickupLongitude: pickupLon,
      dropAddress,
      dropLatitude: dropLat,
      dropLongitude: dropLon,
      customerId: req.user.id,
      otp: generateOTP(),
      status: "SEARCHING_FOR_RIDER",
    },
    include: { customer: true },
  });

  res.status(StatusCodes.CREATED).json({
    message: "Ride created successfully",
    ride,
  });
};

export const acceptRide = async (req, res) => {
  const riderId = req.user.id;
  const { rideId } = req.params;

  if (!rideId) throw new BadRequestError("Ride ID is required");

  let ride = await prisma.ride.findUnique({ where: { id: rideId } });

  if (!ride) throw new NotFoundError("Ride not found");

  if (ride.status !== "SEARCHING_FOR_RIDER") {
    throw new BadRequestError("Ride is no longer available for assignment");
  }

  ride = await prisma.ride.update({
    where: { id: rideId },
    data: { riderId, status: "START" },
    include: { customer: true, rider: true },
  });

  req.socket.to(`ride_${rideId}`).emit("rideUpdate", ride);
  req.socket.to(`ride_${rideId}`).emit("rideAccepted");

  res.status(StatusCodes.OK).json({
    message: "Ride accepted successfully",
    ride,
  });
};

export const updateRideStatus = async (req, res) => {
  const { rideId } = req.params;
  const { status } = req.body;

  if (!rideId || !status) throw new BadRequestError("Ride ID and status are required");

  if (!["START", "ARRIVED", "COMPLETED"].includes(status)) {
    throw new BadRequestError("Invalid ride status");
  }

  let ride = await prisma.ride.findUnique({ where: { id: rideId } });
  if (!ride) throw new NotFoundError("Ride not found");

  ride = await prisma.ride.update({
    where: { id: rideId },
    data: { status },
    include: { customer: true, rider: true },
  });

  req.socket.to(`ride_${rideId}`).emit("rideUpdate", ride);

  res.status(StatusCodes.OK).json({
    message: `Ride status updated to ${status}`,
    ride,
  });
};

export const getMyRides = async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;

  const where = {
    OR: [{ customerId: userId }, { riderId: userId }],
  };

  if (status) where.status = status;

  const rides = await prisma.ride.findMany({
    where,
    include: {
      customer: { select: { id: true, phone: true } },
      rider: { select: { id: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(StatusCodes.OK).json({
    message: "Rides retrieved successfully",
    count: rides.length,
    rides,
  });
};
