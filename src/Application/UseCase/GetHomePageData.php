<?php
declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Repository\FrontendDataRepository;

final readonly class GetHomePageData
{
    public function __construct(private FrontendDataRepository $repository)
    {
    }

    /**
     * @return array<string, mixed>
     */
    public function execute(): array
    {
        $cateringMenus = $this->repository->getActiveCateringMenus();
        $menuItemsRaw = $this->repository->getAvailableMenuItems();
        $successStories = $this->repository->getVisibleSuccessStories();

        $weeklyMenus = array_fill(0, 6, []);
        foreach ($menuItemsRaw as $item) {
            $weeklyMenus[(int)$item['day_index']][] = $item;
        }

        return [
            'cateringMenus' => $cateringMenus,
            'weeklyMenus' => $weeklyMenus,
            'successStories' => $successStories,
        ];
    }
}
