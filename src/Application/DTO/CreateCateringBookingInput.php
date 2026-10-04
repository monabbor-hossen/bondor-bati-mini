<?php
declare(strict_types=1);

namespace App\Application\DTO;

final readonly class CreateCateringBookingInput
{
    public function __construct(
        public string $menuName,
        public int $guestCount,
        public string $clientName,
        public string $phone,
        public string $eventDate,
        public string $venue,
        public ?string $notes,
    ) {}
}