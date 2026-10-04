<?php
declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\CateringBooking;

interface CateringBookingRepository
{
    public function save(CateringBooking $booking): void;
    public function nextBookingNumber(): string;
}