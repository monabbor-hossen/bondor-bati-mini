<?php
declare(strict_types=1);

namespace App\Application\UseCase;

use App\Application\DTO\CreateCateringBookingInput;
use App\Domain\Entity\CateringBooking;
use App\Domain\Repository\CateringBookingRepository;
use DomainException;

final readonly class CreateCateringBooking
{
    public function __construct(
        private CateringBookingRepository $bookingRepository,
    ) {}

    public function execute(CreateCateringBookingInput $input): CateringBooking
    {
        if (trim($input->clientName) === '') {
            throw new DomainException('Client name is required.');
        }
        if (!preg_match('/^(?:\+?88)?01[3-9]\d{8}$/', $input->phone)) {
            throw new DomainException('A valid Bangladeshi phone number is required.');
        }
        if (trim($input->venue) === '') {
            throw new DomainException('Venue address is required.');
        }
        if ($input->guestCount < 10) {
            throw new DomainException('Guest count must be at least 10.');
        }

        $bookingNumber = $this->bookingRepository->nextBookingNumber();

        $booking = new CateringBooking(
            id: 0,
            bookingNumber: $bookingNumber,
            menuName: trim($input->menuName),
            guestCount: $input->guestCount,
            clientName: trim($input->clientName),
            phone: trim($input->phone),
            eventDate: $input->eventDate,
            venue: trim($input->venue),
            notes: $input->notes ? trim($input->notes) : null,
            status: 'pending',
        );

        $this->bookingRepository->save($booking);

        return $booking;
    }
}