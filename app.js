const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let rooms = [];
let bookings = [];

// 1. Creating a Room
app.post('/rooms', (req, res) => {
    const { numberOfSeats, amenities, pricePerHour, name } = req.body;
    const room = { id: rooms.length + 1, numberOfSeats, amenities, pricePerHour, name };
    rooms.push(room);
    res.status(201).send(room);
});

// 2. Booking a Room
app.post('/bookings', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;

    // Check if room is already booked
    const roomBookings = bookings.filter(booking => booking.roomId === roomId && booking.date === date);
    for (const booking of roomBookings) {
        if ((startTime >= booking.startTime && startTime < booking.endTime) || (endTime > booking.startTime && endTime <= booking.endTime)) {
            return res.status(400).send({ message: 'Room is already booked for the given time.' });
        }
    }

    const booking = { id: bookings.length + 1, customerName, date, startTime, endTime, roomId };
    bookings.push(booking);
    res.status(201).send(booking);
});

// 3. List all Rooms with Booked Data
app.get('/rooms/bookings', (req, res) => {
    const roomData = rooms.map(room => {
        const roomBookings = bookings.filter(booking => booking.roomId === room.id);
        return { ...room, bookings: roomBookings };
    });
    res.send(roomData);
});

// 4. List all Customers with Booked Data
app.get('/customers/bookings', (req, res) => {
    const customerBookings = bookings.map(booking => {
        return { customerName: booking.customerName, roomName: rooms.find(room => room.id === booking.roomId).name, date: booking.date, startTime: booking.startTime, endTime: booking.endTime };
    });
    res.send(customerBookings);
});

// 5. List how many times a Customer has booked the Room
app.get('/customers/:name/bookings/count', (req, res) => {
    const customerName = req.params.name;
    const customerBookings = bookings.filter(booking => booking.customerName === customerName);
    const bookingCount = customerBookings.length;
    res.send({ customerName, bookingCount });
});

app.listen(port, () => {
    console.log(`Hall booking app listening at http://localhost:${port}`);
});
