<?php
declare(strict_types=1);

namespace App\Domain\Entity;

final class CateringBooking
{
    public function __construct(
        public readonly int $id,
        public readonly string $bookingNumber,
        public readonly string $menuName,
        public readonly int $guestCount,
        public readonly string $clientName,
        public readonly string $phone,
        public readonly string $eventDate,
        public readonly string $venue,
        public readonly ?string $notes,
        public readonly string $status,
    ) {}

    public function toArray(): array
    {
        return [
            'booking_number' => $this->bookingNumber,
            'menu_name'      => $this->menuName,
            'guest_count'    => $this->guestCount,
            'client_name'    => $this->clientName,
            'phone'          => $this->phone,
            'event_date'     => $this->eventDate,
            'venue'          => $this->venue,
            'notes'          => $this->notes,
            'status'         => $this->status,
        ];
    }
}