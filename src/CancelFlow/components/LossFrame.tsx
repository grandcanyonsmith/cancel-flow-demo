import React from 'react';
import { motion } from 'framer-motion';
import { UserData } from '../steps';

interface LossFrameProps {
  userData: UserData;
  onKeepAccount: () => void;
  onContinueCancel: () => void;
}

export const LossFrame: React.FC<LossFrameProps> = ({
  userData,
  onKeepAccount,
  onContinueCancel
}) => {
  const features = [
    {
      emoji: '1️⃣',
      text: 'Unlimited course hosting & funnels'
    },
    {
      emoji: '2️⃣',
      text: 'Automated email + SMS marketing'
    },
    {
      emoji: '3️⃣',
      text: 'Built-in community & gamification'
    },
    {
      emoji: '4️⃣',
      text: '24/7 live chat (60-sec response)'
    },
    {
      emoji: '5️⃣',
      text: 'Bi-weekly coaching calls with 7-figure creators'
    },
    {
      emoji: '6️⃣',
      text: 'Full Course-Creator education suite (200+ lessons)'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Whoa, {userData.first_name}—canceling means losing all this 🔥
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {userData.is_trial 
            ? `Your trial ends in ${userData.trial_days_remaining} days, then the following features vanish:`
            : `You'll still have access until ${userData.renewal_date}, then the following features vanish:`
          }
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
          >
            <span className="text-2xl flex-shrink-0">{feature.emoji}</span>
            <span className="text-gray-800 dark:text-gray-200 font-medium">
              {feature.text}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onKeepAccount}
          className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
        >
          Keep my CC360 account
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinueCancel}
          className="w-full py-3 px-6 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors duration-200"
        >
          Continue → Cancel
        </motion.button>
      </div>

      {userData.is_trial && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Your trial ends in {userData.trial_days_remaining} days
        </p>
      )}

      {!userData.is_trial && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Your subscription renews {userData.renewal_date}
        </p>
      )}
    </motion.div>
  );
}; 