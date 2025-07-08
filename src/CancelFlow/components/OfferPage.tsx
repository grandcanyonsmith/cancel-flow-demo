import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OfferType, offerConfig, CancellationReason } from '../steps';

interface OfferPageProps {
  offer: OfferType;
  reason: CancellationReason;
  isSecondChance?: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export const OfferPage: React.FC<OfferPageProps> = ({
  offer,
  reason,
  isSecondChance = false,
  onAccept,
  onReject
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const config = offerConfig[offer];

  const handleAccept = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onAccept();
  };

  const getCustomTitle = () => {
    // Custom titles for specific reason/offer combinations
    const customTitles: Record<string, string> = {
      'bugs-performance-30-day-extension': "We'll give you 30 days free on us while we fix the technical issues",
      'missing-feature-50-percent-off': "Half price until we ship what you're missing",
      'just-testing-30-day-extension': "30 days wasn't enough? Here's 30 more days free",
      'other-park-protect': "Pause your account for $29 and keep everything safe.",
      'no-time-30-day-extension': "One final offer: Another month on us, no strings attached",
      'hard-to-learn-done-for-you-buildout': "Final option: Skip the complexity entirely, we'll build it for you.",
      'no-sales-costly-park-protect': "Before you lose your work—park it safely for almost nothing",
      'bugs-performance-park-protect': "Before you lose all your work—park it safely while we iron out the bugs",
      'poor-service-priority-support': "Last chance: 30 days free with guaranteed VIP support",
      'missing-feature-30-day-extension': "Stay free for 30 days while we build what you need.",
      'just-testing-done-for-you-buildout': "Before you leave - Let us prove the value with a real build",
      'other-30-day-extension': "Final offer: 30 days free while we fix whatever went wrong"
    };

    const key = `${reason}-${offer}`;
    return customTitles[key] || config.title;
  };

  const getCustomDescription = () => {
    // Custom descriptions for specific combinations
    const customDescriptions: Record<string, string> = {
      'bugs-performance-30-day-extension': "Submit the exact performance issue and give us 30 days to push a fix (normally takes us less than 7 days). If we can't, you can come back and cancel anytime.",
      'missing-feature-50-percent-off': "Pay 50% less while our development team prioritizes your request. Just tell us the missing feature.",
      'just-testing-30-day-extension': "Most successful users need 45-60 days to see the full picture.",
      'no-time-30-day-extension': "No commitment required—just more time to get things built (or let us build things FOR you).",
      'hard-to-learn-done-for-you-buildout': "Submit a project request on whatever you're needing help building most. Receive a quote within 48 hours (on average).",
      'poor-service-priority-support': "Experience our priority support for 30-days free that jumps every queue.",
      'missing-feature-30-day-extension': "Tell us the missing feature; we'll update you as soon as it ships.",
      'just-testing-done-for-you-buildout': "Skip the testing phase entirely and let us build whatever you need (website, funnel, automation, emails, and more)",
      'other-30-day-extension': "Tell us what went wrong and we'll prioritize fixing it. 30 days on us to earn back your trust."
    };

    const key = `${reason}-${offer}`;
    return customDescriptions[key] || config.description;
  };

  const getCustomCTA = () => {
    // Custom CTAs for specific combinations
    const customCTAs: Record<string, string> = {
      'bugs-performance-30-day-extension': "Report Issue & Get 30 Days Free",
      'missing-feature-50-percent-off': "Claim Discount & Request Feature",
      'just-testing-30-day-extension': "Get 30 More Days Free"
    };

    const key = `${reason}-${offer}`;
    return customCTAs[key] || config.cta;
  };

  const getCustomRejectCTA = () => {
    if (isSecondChance) {
      return "Cancel my subscription";
    }
    return config.rejectCta;
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
          {getCustomTitle()}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {getCustomDescription()}
        </p>
      </div>

      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          onClick={handleAccept}
          disabled={isSubmitting}
          className={`w-full py-4 px-6 font-semibold rounded-lg transition-all duration-200 shadow-lg ${
            isSubmitting
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            getCustomCTA()
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReject}
          disabled={isSubmitting}
          className={`w-full py-3 px-6 font-medium rounded-lg transition-all duration-200 ${
            isSubmitting
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          {getCustomRejectCTA()}
        </motion.button>
      </div>

      {isSecondChance && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
        >
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Last chance:</strong> This is our final offer before your account is cancelled.
          </p>
        </motion.div>
      )}

      {offer === 'park-protect' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Park & Protect:</strong> Your first month is free, then $29/month. Cancel anytime.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}; 