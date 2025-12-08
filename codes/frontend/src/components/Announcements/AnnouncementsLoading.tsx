const AnnouncementsLoading = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 font-medium">
          Loading announcements...
        </p>
      </div>
    </div>
  );
};

export default AnnouncementsLoading;

