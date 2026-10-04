<?php
declare(strict_types=1);

namespace App\Infrastructure\Persistence\MySQL;

use App\Domain\Entity\CateringBooking;
use App\Domain\Repository\CateringBookingRepository;
use PDO;

final readonly class PdoCateringBookingRepository implements CateringBookingRepository
{
    public function __construct(private PDO $pdo) {}

    public function save(CateringBooking $booking): void
    {
        $stmt = $this->pdo->prepare('
            INSERT INTO catering_bookings (booking_number, menu_name, guest_count, client_name, phone, event_date, venue, notes, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        
        $stmt->execute([
            $booking->bookingNumber,
            $booking->menuName,
            $booking->guestCount,
            $booking->clientName,
            $booking->phone,
            $booking->eventDate,
            $booking->venue,
            $booking->notes,
            $booking->status,
        ]);
    }

    public function nextBookingNumber(): string
    {
        $prefix = 'CB-' . date('ymd') . '-';
        $stmt = $this->pdo->query("SELECT MAX(booking_number) FROM catering_bookings WHERE booking_number LIKE '{$prefix}%'");
        $last = $stmt->fetchColumn();
        
        if ($last) {
            $seq = (int) substr($last, -3) + 1;
        } else {
            $seq = 1;
        }
        
        return $prefix . str_pad((string) $seq, 3, '0', STR_PAD_LEFT);
    }
}