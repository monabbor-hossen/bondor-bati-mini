<?php
declare(strict_types=1);

namespace App\Domain\Repository;

interface FrontendDataRepository
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public function getActiveCateringMenus(): array;

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getAvailableMenuItems(): array;

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getVisibleSuccessStories(): array;
}
