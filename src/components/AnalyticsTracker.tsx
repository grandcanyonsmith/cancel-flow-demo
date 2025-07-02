import { useEffect } from 'react'

interface AnalyticsEvent {
  type:
    | 'step_view'
    | 'option_select'
    | 'flow_complete'
    | 'flow_reset'
    | 'theme_toggle'
  data: Record<string, string | number | boolean>
  timestamp: number
}

class AnalyticsService {
  private events: AnalyticsEvent[] = []
  private readonly storageKey = 'cancel-flow-analytics'

  constructor() {
    this.loadStoredEvents()
  }

  private loadStoredEvents() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        this.events = JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to load analytics events:', error)
    }
  }

  private saveEvents() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.events))
    } catch (error) {
      console.warn('Failed to save analytics events:', error)
    }
  }

  track(
    type: AnalyticsEvent['type'],
    data: Record<string, string | number | boolean> = {},
  ) {
    const event: AnalyticsEvent = {
      type,
      data,
      timestamp: Date.now(),
    }

    this.events.push(event)
    this.saveEvents()

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('📊 Analytics Event:', event)
    }

    // In a real app, you would send this to your analytics service
    // this.sendToAnalyticsService(event)
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  getAnalytics() {
    const events = this.getEvents()

    return {
      totalEvents: events.length,
      stepViews: events.filter((e) => e.type === 'step_view').length,
      optionSelects: events.filter((e) => e.type === 'option_select').length,
      flowCompletions: events.filter((e) => e.type === 'flow_complete').length,
      flowResets: events.filter((e) => e.type === 'flow_reset').length,
      themeToggles: events.filter((e) => e.type === 'theme_toggle').length,
      mostSelectedOptions: this.getMostSelectedOptions(events),
      averageSessionDuration: this.getAverageSessionDuration(events),
      completionRate: this.getCompletionRate(events),
    }
  }

  private getMostSelectedOptions(events: AnalyticsEvent[]) {
    const optionCounts: Record<string, number> = {}

    events
      .filter((e) => e.type === 'option_select')
      .forEach((e) => {
        const option = e.data.option
        optionCounts[option] = (optionCounts[option] || 0) + 1
      })

    return Object.entries(optionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([option, count]) => ({ option, count }))
  }

  private getAverageSessionDuration(events: AnalyticsEvent[]) {
    if (events.length < 2) return 0

    const sessions: number[] = []
    let sessionStart = events[0]?.timestamp

    for (let i = 1; i < events.length; i++) {
      const event = events[i]

      if (event.type === 'flow_complete' || event.type === 'flow_reset') {
        if (sessionStart) {
          sessions.push(event.timestamp - sessionStart)
        }
        sessionStart = events[i + 1]?.timestamp
      }
    }

    return sessions.length > 0
      ? Math.round(sessions.reduce((a, b) => a + b, 0) / sessions.length / 1000)
      : 0
  }

  private getCompletionRate(events: AnalyticsEvent[]) {
    const completions = events.filter((e) => e.type === 'flow_complete').length
    const resets = events.filter((e) => e.type === 'flow_reset').length
    const total = completions + resets

    return total > 0 ? Math.round((completions / total) * 100) : 0
  }

  clear() {
    this.events = []
    localStorage.removeItem(this.storageKey)
  }
}

// Singleton instance
export const analytics = new AnalyticsService()

// Hook for easy usage in components
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    getAnalytics: analytics.getAnalytics.bind(analytics),
    clear: analytics.clear.bind(analytics),
  }
}

// Component that tracks step views automatically
interface AnalyticsTrackerProps {
  stepId: string
  stepType: string
}

export const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({
  stepId,
  stepType,
}) => {
  useEffect(() => {
    analytics.track('step_view', {
      stepId,
      stepType,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    })
  }, [stepId, stepType])

  return null
}
