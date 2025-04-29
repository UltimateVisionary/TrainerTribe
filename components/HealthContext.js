import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Pedometer } from "expo-sensors";
import * as Location from "expo-location";
import PropTypes from 'prop-types';
// For heart rate, HRV, sleep data, you can integrate native modules like react-native-health

const HealthContext = createContext();



export const HealthProvider = ({ children }) => {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  // Add default values for heartRate, hrv, sleepData
  const [heartRate, setHeartRate] = useState(null);
  const [hrv, setHrv] = useState(null);
  const [sleepData, setSleepData] = useState(null);
  // Track daily steps for last 7 days
  const initialHistory = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { date: d.toISOString().split("T")[0], steps: 0 };
  }), []);
  const [dailyStepsHistory, setDailyStepsHistory] = useState(initialHistory);
  // Tribe Tokens economy
  const [tokens, setTokens] = useState(0);
  const redeemTokens = (cost) => {
    if (tokens >= cost) {
      setTokens(prev => prev - cost);
      return true;
    }
    return false;
  };

  useEffect(() => {
    let pedSub, locSub;
    // Subscribe to step counts
    pedSub = Pedometer.watchStepCount(({ steps: s }) => {
      setSteps(s);
      setCalories(estimateCalories(s));
      // update today's history
      const today = new Date().toISOString().split("T")[0];
      setDailyStepsHistory(prev => prev.map(entry => entry.date === today ? { ...entry, steps: s } : entry));
    });
    // Subscribe to GPS for distance
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        locSub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 1 },
          ({ coords }) => setDistance(prev => prev + coords.speed)
        );
      }
    })();
    // TODO: integrate heart rate, HRV, sleep via native modules
    return () => {
      pedSub && pedSub.remove();
      locSub && locSub.remove();
    };
  }, []);

  const estimateCalories = (steps) => Math.round(steps * 0.04); // approx

  const logWorkout = (entry) => {
    setWorkoutLogs(prev => [...prev, { ...entry, timestamp: new Date() }]);
    setTokens(prev => prev + 10); // Earn 10 Tribe Tokens per workout
  };

  return (
    <HealthContext.Provider value={{
      steps,
      distance,
      heartRate,
      hrv,
      sleepData,
      calories,
      workoutLogs,
      logWorkout,
      dailyStepsHistory,
      tokens,
      redeemTokens,
    }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext);

HealthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
