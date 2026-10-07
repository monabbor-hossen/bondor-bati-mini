<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

http_response_code(404);

$pageTitle       = 'Page Not Found - Bondor Bati';
$pageDescription = 'The page you are looking for could not be found.';
$currentPage     = '404';

require __DIR__ . '/views/frontend/partials/header.php';
?>

<div class="min-h-[75vh] w-full flex flex-col relative px-3 sm:px-6 md:px-10 lg:px-[100px] pt-32 md:pt-40 pb-16 max-w-[1600px] mx-auto items-center justify-center z-10">
    <div class="dashboard-container w-full flex flex-col relative p-10 sm:p-16 overflow-hidden items-center justify-center max-w-4xl text-center bg-white shadow-xl rounded-[20px] border border-gray-100 min-h-[50vh]">
        
        <h1 class="font-nunito-black text-[80px] sm:text-[120px] leading-none text-[#af0202] mb-2 drop-shadow-md">
            404
        </h1>
        
        <h2 class="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Page Not Found
        </h2>
        
        <p class="text-gray-500 text-base sm:text-lg mb-8 max-w-lg mx-auto font-medium">
            Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        
        <a href="index.php" class="btn-hero-primary inline-flex items-center justify-center px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Home
        </a>
        
    </div>
</div>

<?php require __DIR__ . '/views/frontend/partials/footer.php'; ?>
