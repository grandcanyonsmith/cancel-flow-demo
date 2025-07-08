import React from 'react';
import { motion } from 'framer-motion';
import { UserData } from '../steps';

interface GoodbyePageProps {
  userData: UserData;
  onFinishCancellation: () => void;
}

export const GoodbyePage: React.FC<GoodbyePageProps> = ({
  userData,
  onFinishCancellation
}) => {
  const handleVideoClick = () => {
    // In a real app, this would open the video in a modal or new tab
    window.open('https://example.com/jane-5k-case-study', '_blank');
  };

  const handleFacebookGroupClick = () => {
    // In a real app, this would link to the actual Facebook group
    window.open('https://facebook.com/groups/cc360-community', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          We're sad to see you go, {userData.first_name} 💔
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Your account stays active until <strong>{userData.renewal_date}</strong>. 
          After that, your content is archived for 30 days in case you change your mind.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Before you go, here are some helpful resources:
        </h2>
        
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVideoClick}
            className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  📹 Replay: "How Jane hit $5K in 30 days"
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Watch this inspiring case study video
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFacebookGroupClick}
            className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  👥 Join our free Facebook group
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Keep learning with our community
                </p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onFinishCancellation}
        className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
      >
        Finish cancellation
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Note:</strong> A confirmation email will arrive in minutes. 
          We'll keep your data for 30 days in case you change your mind later.
        </p>
      </motion.div>
    </motion.div>
  );
}; 