import React from 'react';
import { motion } from 'framer-motion';
import { useCancelFlow } from './useCancelFlow';
import { ProgressBar } from './components/ProgressBar';
import { LossFrame } from './components/LossFrame';
import { ReasonSurvey } from './components/ReasonSurvey';
import { OfferPage } from './components/OfferPage';
import { GoodbyePage } from './components/GoodbyePage';
import { CancellationConfirmed } from './components/CancellationConfirmed';
import { getOfferForReason } from './steps';

export const CancelFlow: React.FC = () => {
  const { 
    current, 
    feedback, 
    progress, 
    userData,
    selectReason,
    acceptOffer,
    rejectOffer,
    keepAccount,
    finishCancellation,
    reset 
  } = useCancelFlow();

  const renderCurrentStep = () => {
    switch (current.kind) {
      case 'loss-frame':
        return (
          <LossFrame
            userData={userData}
            onKeepAccount={keepAccount}
            onContinueCancel={() => selectReason(null)}
          />
        );

      case 'reason-survey':
        return (
          <ReasonSurvey
            onReasonSelect={selectReason}
          />
        );

      case 'tailored-offer':
        const firstOffer = getOfferForReason(feedback.reason!, false);
        return (
          <OfferPage
            offer={firstOffer}
            reason={feedback.reason!}
            isSecondChance={false}
            onAccept={() => acceptOffer(firstOffer, false)}
            onReject={() => rejectOffer(firstOffer, false)}
          />
        );

      case 'second-chance-offer':
        const secondOffer = getOfferForReason(feedback.reason!, true);
        return (
          <OfferPage
            offer={secondOffer}
            reason={feedback.reason!}
            isSecondChance={true}
            onAccept={() => acceptOffer(secondOffer, true)}
            onReject={() => rejectOffer(secondOffer, true)}
          />
        );

      case 'goodbye':
        return (
          <GoodbyePage
            userData={userData}
            onFinishCancellation={finishCancellation}
          />
        );

      case 'cancellation-confirmed':
        return (
          <CancellationConfirmed
            onRedirect={() => {
              // In a real app, redirect to dashboard or home
              console.log('Redirecting to dashboard...');
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto mt-10 w-full max-w-2xl rounded-2xl border bg-white p-8 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
    >
      {progress.total > 1 && current.kind !== 'cancellation-confirmed' && (
        <div className="mb-8">
          <ProgressBar {...progress} />
        </div>
      )}

      {renderCurrentStep()}

      {current.kind !== 'cancellation-confirmed' && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={reset}
            className="w-full text-sm text-zinc-400 hover:text-blue-600 hover:underline transition-colors duration-200"
          >
            Never mind, I don't want to cancel.
          </button>
        </div>
      )}
    </motion.div>
  );
};
