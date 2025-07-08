import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CancellationReason, cancellationReasons, shuffleArray } from '../steps';

interface ReasonSurveyProps {
  onReasonSelect: (reason: CancellationReason, otherReason?: string) => void;
}

export const ReasonSurvey: React.FC<ReasonSurveyProps> = ({ onReasonSelect }) => {
  const [shuffledReasons, setShuffledReasons] = useState(cancellationReasons);
  const [selectedReason, setSelectedReason] = useState<CancellationReason | null>(null);
  const [otherReasonText, setOtherReasonText] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  useEffect(() => {
    // Randomize the order of reasons to prevent chronology bias
    setShuffledReasons(shuffleArray(cancellationReasons));
  }, []);

  const handleReasonClick = (reason: CancellationReason) => {
    setSelectedReason(reason);
    
    if (reason === 'other') {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      setOtherReasonText('');
    }
  };

  const handleSubmit = () => {
    if (!selectedReason) return;
    
    if (selectedReason === 'other' && !otherReasonText.trim()) {
      return; // Don't submit if "other" is selected but no text is provided
    }
    
    onReasonSelect(selectedReason, otherReasonText.trim() || undefined);
  };

  const canSubmit = selectedReason && (selectedReason !== 'other' || otherReasonText.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Two clicks, tops: why are you thinking of leaving?
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Pick the one that fits best. We'll fix it or get out of your way in under a minute.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {shuffledReasons.map((reason, index) => (
          <motion.div
            key={reason.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <button
              onClick={() => handleReasonClick(reason.key)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedReason === reason.key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedReason === reason.key
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-400 dark:border-gray-600'
                }`}>
                  {selectedReason === reason.key && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-gray-900 dark:text-white font-medium">
                  {reason.label}
                </span>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {showOtherInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <textarea
            value={otherReasonText}
            onChange={(e) => setOtherReasonText(e.target.value)}
            placeholder="Please tell us more about your reason for canceling..."
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            autoFocus
          />
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: canSubmit ? 1.02 : 1 }}
        whileTap={{ scale: canSubmit ? 0.98 : 1 }}
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-4 px-6 font-semibold rounded-lg transition-all duration-200 ${
          canSubmit
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg cursor-pointer'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }`}
      >
        Next →
      </motion.button>
    </motion.div>
  );
}; 