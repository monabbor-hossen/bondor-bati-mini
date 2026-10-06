<?php
namespace App\Controllers;

use App\Infrastructure\Persistence\MySQL\ConnectionFactory;
use App\Infrastructure\Persistence\MySQL\PdoFrontendDataRepository;
use App\Application\UseCase\GetHomePageData;

class FrontendController {
    public function index() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['csrf_token'] ??= bin2hex(random_bytes(32));
        
        $db = ConnectionFactory::create();
        $repository = new PdoFrontendDataRepository($db);
        $useCase = new GetHomePageData($repository);
        
        $data = $useCase->execute();
        $cateringMenus = $data['cateringMenus'];
        $weeklyMenus = $data['weeklyMenus'];
        $successStories = $data['successStories'];
        
        require __DIR__ . '/../../views/frontend/home.php';
    }
}
