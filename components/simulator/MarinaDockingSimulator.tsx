"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ResultState = "RUNNING" | "SUCCESS" | "COLLISION" | "FAILED";
type ScenarioKey = "training" | "night" | "tight" | "windy";
type CameraMode = "normal" | "cinematic";
type MarinaKey =
  | "classicMarina"
  | "woodenPier"
  | "narrowBay"
  | "modernMarina";
type BoatKey = "sailingYacht" | "motorYacht" | "twinEngineCatamaran";

type ControlState = {
  throttle: number;
  rudder: number;
  bowThruster: number;
};

type Obstacle = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
};

type WakePoint = {
  id: number;
  x: number;
  y: number;
  heading: number;
  intensity: number;
  life: number;
};

type Pose = {
  x: number;
  y: number;
  heading: number;
};

type ScenarioConfig = {
  label: string;
  description: string;
  night: boolean;
  windDirection: number;
  windForce: number;
  difficulty: string;
  start: Pose;
  target: Pose;
};

type MarinaConfig = {
  label: string;
  description: string;
  background: string;
  start: Pose;
  target: Pose;
  dockView: {
    width: number;
    height: number;
  };
};

type BoatConfig = {
  label: string;
  description: string;
  length: number;
  width: number;
  drag: number;
  rudderPower: number;
  bowThrusterPower: number;
  windDriftFactor: number;
  windYawFactor: number;
  enginePower: number;
  reversePower: number;
  pivotPower: number;
  wakeFactor: number;
  image: string;
};

const DEFAULT_START: Pose = {
  x: 230,
  y: 440,
  heading: 90,
};

const OBSTACLES: Obstacle[] = [
  { x: 420, y: 210, w: 420, h: 70, label: "MAIN PIER" },
  { x: 555, y: 70, w: 90, h: 420, label: "DOCK WALL" },
  { x: 355, y: 270, w: 12, h: 110, label: "FINGER" },
  { x: 430, y: 270, w: 12, h: 110, label: "FINGER" },
  { x: 505, y: 270, w: 12, h: 110, label: "FINGER" },
  { x: 580, y: 270, w: 12, h: 110, label: "FINGER" },
  { x: 655, y: 270, w: 12, h: 110, label: "FINGER" },
  { x: 730, y: 270, w: 12, h: 110, label: "FINGER" },
];

const MARINAS: Record<MarinaKey, MarinaConfig> = {
  classicMarina: {
    label: " Simulator Marina",
    description: "İlk simülasyondaki klasik marina sahnesi geri eklendi.",
    background: "/images/simulator/marina-bg.jpg",

    start: {
      x: 240,
      y: 520,
      heading: 90,
    },

    target: {
      x: 610,
      y: 500,
      heading: 0,
    },
    dockView: {
      width: 50,
      height: 175,
    }
  },

  woodenPier: {
    label: "Ahşap İskele / Koy",
    description: "Sığ koy, ahşap iskele ve doğal rüzgar etkisi.",
    background: "/images/simulator/pier-bay.jpg",

    start: {
      x: 250,
      y: 470,
      heading: 60,
    },

    target: {
      x: 410,
      y: 390,
      heading: 0,
    },
    dockView: {
      width: 90,
      height: 150,
    }
  },

  narrowBay: {
    label: "Dar Koy İskelesi",
    description:
      "Dar koy içinde sınırlı dönüş alanı ve hassas yaklaşma.",

    background: "/images/simulator/narrow-bay.jpg",

    start: {
      x: 180,
      y: 560,
      heading: 35,
    },

    target: {
      x: 390,
      y: 605,
      heading: 150,
    },
    dockView: {
      width: 90,
      height: 170,
    }
  },

  modernMarina: {
    label: "Modern Marina",
    description:
      "Modern marina, pontonlar ve yoğun tekne trafiği.",

    background: "/images/simulator/harbor-marina.jpg",

    start: {
      x: 220,
      y: 620,
      heading: 140,
    },

    target: {
      x: 55,
      y: 400,
      heading: 50,
    },
    dockView: {
      width: 10,
      height: 145,
    }
  },
};

const SCENARIOS: Record<ScenarioKey, ScenarioConfig> = {
  training: {
    label: "İskele Yanaşma Eğitimi",
    description: "Geniş su alanından kontrollü iskele yaklaşması.",
    night: false,
    windDirection: 75,
    windForce: 0.35,
    difficulty: "NORMAL",
    start: { x: 230, y: 440, heading: 90 },
    target: { x: 575, y: 455, heading: 0 },
  },

  night: {
    label: "Gece İskele Yanaşması",
    description: "Gece ışıkları ve düşük görüş ile hassas yaklaşma.",
    night: true,
    windDirection: 95,
    windForce: 0.45,
    difficulty: "ADVANCED",
    start: { x: 250, y: 430, heading: 90 },
    target: { x: 575, y: 455, heading: 0 },
  },

  tight: {
    label: "Dar İskele Manevrası",
    description: "Dar alanda baş-kıç hizasını koruyarak yanaşma.",
    night: false,
    windDirection: 55,
    windForce: 0.5,
    difficulty: "PRO",
    start: { x: 260, y: 455, heading: 85 },
    target: { x: 595, y: 455, heading: 0 },
  },

  windy: {
    label: "Yan Rüzgarda İskele Yanaşması",
    description: "Yan rüzgar altında drift’i kontrol ederek yanaşma.",
    night: false,
    windDirection: 125,
    windForce: 1.05,
    difficulty: "HARD",
    start: { x: 220, y: 455, heading: 90 },
    target: { x: 600, y: 455, heading: 0 },
  },
};

const BOATS: Record<BoatKey, BoatConfig> = {
  sailingYacht: {
    label: "Sailing Yacht",
    description:
      "Yelkenli yat: rüzgardan daha fazla etkilenir, daha ağır döner, eğitim zorluğu orta seviyededir.",
    length: 92,
    width: 30,
    drag: 0.985,
    rudderPower: 0.82,
    bowThrusterPower: 1.05,
    windDriftFactor: 1.15,
    windYawFactor: 1.15,
    enginePower: 0.045,
    reversePower: 0.65,
    pivotPower: 0,
    wakeFactor: 1,
    image: "/images/simulator/sailing-yacht.png",
  },

  motorYacht: {
    label: "Motor Yacht",
    description:
      "Motoryat: motor tepkisi güçlü, düşük hız kontrolü daha kolay, marina manevrasında daha dengeli davranır.",
    length: 88,
    width: 36,
    drag: 0.98,
    rudderPower: 1.18,
    bowThrusterPower: 1.35,
    windDriftFactor: 0.85,
    windYawFactor: 0.8,
    enginePower: 0.058,
    reversePower: 0.82,
    pivotPower: 0.55,
    wakeFactor: 1.25,
    image: "/images/simulator/motor-yacht.png",
  },

  twinEngineCatamaran: {
    label: "Twin Engine Catamaran",
    description:
      "Çift motorlu katamaran: geniş gövde, yüksek rüzgar alanı ve çift motor pivot kabiliyeti; zorluk seviyesi yüksektir.",
    length: 90,
    width: 50,
    drag: 0.984,
    rudderPower: 0.76,
    bowThrusterPower: 1.45,
    windDriftFactor: 1.45,
    windYawFactor: 0.75,
    enginePower: 0.052,
    reversePower: 0.76,
    pivotPower: 1.35,
    wakeFactor: 1.4,
    image: "/images/simulator/catamaran.png",
  },
};

function normalizeHeading(value: number) {
  return ((value % 360) + 360) % 360;
}

function headingDiff(a: number, b: number) {
  const diff = Math.abs(normalizeHeading(a) - normalizeHeading(b));
  return Math.min(diff, 360 - diff);
}

function distance(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function pointInRect(px: number, py: number, rect: Obstacle) {
  return (
    px >= rect.x &&
    px <= rect.x + rect.w &&
    py >= rect.y &&
    py <= rect.y + rect.h
  );
}

function getBoatGeometry(
  x: number,
  y: number,
  heading: number,
  boatConfig: BoatConfig
) {
  const rad = (heading * Math.PI) / 180;
  const sideRad = ((heading + 90) * Math.PI) / 180;

  const bowX = x + Math.sin(rad) * boatConfig.length * 0.5;
  const bowY = y - Math.cos(rad) * boatConfig.length * 0.5;

  const sternX = x - Math.sin(rad) * boatConfig.length * 0.5;
  const sternY = y + Math.cos(rad) * boatConfig.length * 0.5;

  const portX = x - Math.sin(sideRad) * boatConfig.width * 0.5;
  const portY = y + Math.cos(sideRad) * boatConfig.width * 0.5;

  const starboardX = x + Math.sin(sideRad) * boatConfig.width * 0.5;
  const starboardY = y - Math.cos(sideRad) * boatConfig.width * 0.5;

  return {
    bowX,
    bowY,
    sternX,
    sternY,
    portX,
    portY,
    starboardX,
    starboardY,
  };
}

function boatHitsObstacle(
  x: number,
  y: number,
  heading: number,
  boatConfig: BoatConfig
) {
  const g = getBoatGeometry(x, y, heading, boatConfig);

  const checkPoints = [
    { x, y },
    { x: g.bowX, y: g.bowY },
    { x: g.sternX, y: g.sternY },
    { x: g.portX, y: g.portY },
    { x: g.starboardX, y: g.starboardY },
  ];

  return OBSTACLES.some((obstacle) =>
    checkPoints.some((point) => pointInRect(point.x, point.y, obstacle))
  );
}

export default function MarinaDockingSimulator() {
  const [selectedMarina, setSelectedMarina] =
    useState<MarinaKey>("classicMarina");
  const [selectedBoat, setSelectedBoat] =
    useState<BoatKey>("sailingYacht");

  const [x, setX] = useState(DEFAULT_START.x);
  const [y, setY] = useState(DEFAULT_START.y);
  const [heading, setHeading] = useState(DEFAULT_START.heading);
  const [speed, setSpeed] = useState(0);
  const [rudder, setRudder] = useState(0);
  const [bowThruster, setBowThruster] = useState(0);

  const [result, setResult] = useState<ResultState>("RUNNING");
  const [attempts, setAttempts] = useState(1);
  const [wakeTrail, setWakeTrail] = useState<WakePoint[]>([]);

  const [scenario, setScenario] = useState<ScenarioKey>("training");
  const [nightMode, setNightMode] = useState(false);
  const [aisOverlay, setAisOverlay] = useState(true);
  const [radarOverlay, setRadarOverlay] = useState(true);
  const [mooringLines, setMooringLines] = useState(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>("normal");
  const [showObstacles, setShowObstacles] = useState(false);

  const [windDirection, setWindDirection] = useState(75);
  const [windForce, setWindForce] = useState(0.35);

  const controlsRef = useRef<ControlState>({
    throttle: 0,
    rudder: 0,
    bowThruster: 0,
  });

  const physicsRef = useRef({
    x: DEFAULT_START.x,
    y: DEFAULT_START.y,
    heading: DEFAULT_START.heading,
    speed: 0,
  });

  const resultRef = useRef<ResultState>("RUNNING");
  const wakeIdRef = useRef(0);
  const frameCountRef = useRef(0);

  const activeMarina = MARINAS[selectedMarina];
  const activeBoat = BOATS[selectedBoat];
  const activeScenario = SCENARIOS[scenario];
  const activeTarget = activeMarina.target;

  const boatGeometry = useMemo(
    () => getBoatGeometry(x, y, heading, activeBoat),
    [x, y, heading, activeBoat]
  );

  const targetGeometry = useMemo(
  () =>
    getBoatGeometry(
      activeMarina.target.x,
      activeMarina.target.y,
      activeMarina.target.heading,
      activeBoat
    ),
  [activeMarina, activeBoat]
);

  const dockingDistance = useMemo(
    () => distance(x, y, activeMarina.target.x, activeMarina.target.y),
    [x, y, activeMarina.target.x, activeMarina.target.y]
  );

  const bowDistance = useMemo(
    () =>
      distance(
        boatGeometry.bowX,
        boatGeometry.bowY,
        targetGeometry.bowX,
        targetGeometry.bowY
      ),
    [boatGeometry, targetGeometry]
  );

  const sternDistance = useMemo(
    () =>
      distance(
        boatGeometry.sternX,
        boatGeometry.sternY,
        targetGeometry.sternX,
        targetGeometry.sternY
      ),
    [boatGeometry, targetGeometry]
  );

  const dockingAngleError = useMemo(
    () => headingDiff(heading, activeTarget.heading),
    [heading, activeTarget.heading]
  );

  const collisionRisk = useMemo(() => {
    return boatHitsObstacle(x, y, heading, activeBoat);
  }, [x, y, heading, activeBoat]);

  const dockingStatus = useMemo(() => {
    if (result === "SUCCESS") return "SECURED ALONGSIDE";
    if (result === "COLLISION") return "COLLISION WARNING";
    if (result === "FAILED") return "FAILED APPROACH";
    if (collisionRisk && showObstacles) return "COLLISION RISK";

    if (
      bowDistance < 52 &&
      sternDistance < 52 &&
      Math.abs(speed) < 0.85 &&
      dockingAngleError < 22
    ) {
      return "READY TO SECURE";
    }

    if (dockingDistance < 100 && Math.abs(speed) < 1.05) {
      return "FINAL APPROACH";
    }

    if (Math.abs(speed) > 2.4) return "SLOW DOWN";

    return "TRAINING ACTIVE";
  }, [
    result,
    collisionRisk,
    showObstacles,
    bowDistance,
    sternDistance,
    dockingDistance,
    speed,
    dockingAngleError,
  ]);

  const maneuverAdvice = useMemo(() => {
    if (result === "SUCCESS")
      return "Yanaşma tamamlandı. Halatlar alınabilir.";

    if (result === "COLLISION")
      return "Temas oluştu. Daha düşük hız ve daha erken dümen kullan.";

    if (result === "FAILED")
      return "Hedef alana hızlı girdin. Son yaklaşmada gazı kes ve rüzgarla süzül.";

    if (collisionRisk && showObstacles) {
      return "Çarpışma bölgesine çok yakınsın. Hızı düşür ve baş açını güvenli suya çevir.";
    }

    if (selectedBoat === "sailingYacht") {
      return "Yelkenli yat rüzgardan daha fazla etkilenir. Hızı düşük tut, dümeni erken ve yumuşak kullan.";
    }

    if (selectedBoat === "motorYacht") {
      return "Motoryatta motor tepkisi güçlüdür. Kısa ve küçük gaz komutlarıyla yaklaş.";
    }

    if (selectedBoat === "twinEngineCatamaran") {
      return "Çift motorlu katamaran geniş gövdeli ve rüzgar alanı büyüktür. Küçük motor farklarıyla pivot kullan.";
    }

    if (Math.abs(speed) > 2.1) {
      return "Hız yüksek. Yanaşma öncesi gazı azalt, tekneyi süzülmeye bırak.";
    }

    if (dockingAngleError > 35 && dockingDistance < 150) {
      return "Açı hatası büyük. Baş-kıç hattını hedef iskele çizgisine paralel hale getir.";
    }

    if (bowDistance > sternDistance + 35) {
      return "Baş taraf geride kalıyor. Bow thruster veya kısa dümenle başı hedefe yaklaştır.";
    }

    if (sternDistance > bowDistance + 35) {
      return "Kıç taraf geride kalıyor. İleri/geri küçük hareketlerle kıçı hizala.";
    }

    if (windForce > 0.7) {
      return "Rüzgar etkisi belirgin. Rüzgaraltına düşmeden önce küçük düzeltmeler yap.";
    }

    if (dockingDistance < 100) {
      return "Son yaklaşma, çok küçük gaz, küçük dümen ve düşük hızla ilerle.";
    }

    return "Kontrollü ilerle. Önce hızını düşük tut, sonra baş-kıç hizasını hedefe oturt.";
  }, [
    result,
    collisionRisk,
    showObstacles,
    selectedBoat,
    speed,
    dockingAngleError,
    dockingDistance,
    bowDistance,
    sternDistance,
    windForce,
  ]);

  const cameraScale = useMemo(() => {
    if (cameraMode === "normal") return 1;
    if (dockingDistance < 120) return 1.13;
    return 1.04;
  }, [cameraMode, dockingDistance]);

  function resetSimulatorForScenario(
    targetScenario: ScenarioKey,
    incrementAttempt = true
  ) {
    const config = SCENARIOS[targetScenario];

    physicsRef.current = {
      x: config.start.x,
      y: config.start.y,
      heading: config.start.heading,
      speed: 0,
    };

    controlsRef.current = {
      throttle: 0,
      rudder: 0,
      bowThruster: 0,
    };

    resultRef.current = "RUNNING";
    wakeIdRef.current = 0;
    frameCountRef.current = 0;

    setX(config.start.x);
    setY(config.start.y);
    setHeading(config.start.heading);
    setSpeed(0);
    setRudder(0);
    setBowThruster(0);
    setResult("RUNNING");
    setWakeTrail([]);
    setMooringLines(false);

    if (incrementAttempt) {
      setAttempts((value) => value + 1);
    }
  }

  function applyScenario(nextScenario: ScenarioKey) {
    const config = SCENARIOS[nextScenario];

    setScenario(nextScenario);
    setWindDirection(config.windDirection);
    setWindForce(config.windForce);
    setNightMode(config.night);

    resetSimulatorForScenario(nextScenario, false);
  }

  function resetSimulator(incrementAttempt = true) {
    resetSimulatorForScenario(scenario, incrementAttempt);
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        e.preventDefault();
      }

      if (resultRef.current !== "RUNNING") return;

      if (e.key === "ArrowUp") controlsRef.current.throttle = 1;
      if (e.key === "ArrowDown")
        controlsRef.current.throttle = -activeBoat.reversePower;
      if (e.key === "ArrowLeft") controlsRef.current.rudder = -1;
      if (e.key === "ArrowRight") controlsRef.current.rudder = 1;
      if (e.key.toLowerCase() === "a") controlsRef.current.bowThruster = -1;
      if (e.key.toLowerCase() === "d") controlsRef.current.bowThruster = 1;
    };

    const up = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        e.preventDefault();
      }

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        controlsRef.current.throttle = 0;
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        controlsRef.current.rudder = 0;
      }

      if (e.key.toLowerCase() === "a" || e.key.toLowerCase() === "d") {
        controlsRef.current.bowThruster = 0;
      }
    };

    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up, { passive: false });

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [activeBoat.reversePower]);

  useEffect(() => {
    resetSimulatorForScenario(scenario, false);
  }, [selectedBoat]);

  useEffect(() => {
    let frame = 0;

    const loop = () => {
      const boat = physicsRef.current;
      const controls = controlsRef.current;

      if (resultRef.current === "RUNNING") {
        const scenarioDrag =
          scenario === "tight"
            ? activeBoat.drag - 0.003
            : scenario === "windy"
              ? activeBoat.drag - 0.004
              : activeBoat.drag;

        boat.speed += controls.throttle * activeBoat.enginePower;
        boat.speed *= scenarioDrag;

        if (Math.abs(boat.speed) < 0.01) boat.speed = 0;

        const windRad = (windDirection * Math.PI) / 180;

        const rudderFactor = Math.min(1, Math.abs(boat.speed) / 1.8);
        const rudderTurn =
          controls.rudder *
          boat.speed *
          activeBoat.rudderPower *
          rudderFactor;

        const lowSpeedFactor = clamp(1 - Math.abs(boat.speed) * 0.35, 0.25, 1);
        const bowThrusterTurn =
          controls.bowThruster *
          activeBoat.bowThrusterPower *
          lowSpeedFactor;

        const twinEnginePivot =
          controls.rudder *
          activeBoat.pivotPower *
          lowSpeedFactor *
          0.16;

        const windSideArea = Math.abs(
          Math.sin(((windDirection - boat.heading) * Math.PI) / 180)
        );

        const windDriftPower =
          windForce *
          activeBoat.windDriftFactor *
          (0.11 + windSideArea * 0.12);

        const windYaw =
          Math.sin(((windDirection - boat.heading) * Math.PI) / 180) *
          windForce *
          activeBoat.windYawFactor *
          0.045;

        boat.heading += rudderTurn;
        boat.heading += bowThrusterTurn;
        boat.heading += twinEnginePivot;
        boat.heading += windYaw;
        boat.heading = normalizeHeading(boat.heading);

        const updatedHeadingRad = (boat.heading * Math.PI) / 180;

        boat.x += Math.sin(updatedHeadingRad) * boat.speed;
        boat.y -= Math.cos(updatedHeadingRad) * boat.speed;

        boat.x += Math.sin(windRad) * windDriftPower;
        boat.y -= Math.cos(windRad) * windDriftPower;

        boat.x = clamp(boat.x, 40, 1040);
        boat.y = clamp(boat.y, 40, 720);

        frameCountRef.current += 1;

        if (frameCountRef.current % 5 === 0 && Math.abs(boat.speed) > 0.08) {
          const wakeRad = (boat.heading * Math.PI) / 180;
          const sternX =
            boat.x - Math.sin(wakeRad) * activeBoat.length * 0.5;
          const sternY =
            boat.y + Math.cos(wakeRad) * activeBoat.length * 0.5;

          const intensity =
            Math.min(1, Math.abs(boat.speed) / 3.2) * activeBoat.wakeFactor;

          setWakeTrail((previous) => [
            {
              id: wakeIdRef.current++,
              x: sternX,
              y: sternY,
              heading: boat.heading,
              intensity,
              life: 1,
            },
            ...previous
              .map((point) => ({
                ...point,
                life: point.life - 0.07,
              }))
              .filter((point) => point.life > 0)
              .slice(0, 34),
          ]);
        } else if (frameCountRef.current % 5 === 0) {
          setWakeTrail((previous) =>
            previous
              .map((point) => ({
                ...point,
                life: point.life - 0.07,
              }))
              .filter((point) => point.life > 0)
          );
        }

        const hitObstacle = boatHitsObstacle(
          boat.x,
          boat.y,
          boat.heading,
          activeBoat
        );

        const liveGeometry = getBoatGeometry(
          boat.x,
          boat.y,
          boat.heading,
          activeBoat
        );

        const liveBowDistance = distance(
          liveGeometry.bowX,
          liveGeometry.bowY,
          targetGeometry.bowX,
          targetGeometry.bowY
        );

        const liveSternDistance = distance(
          liveGeometry.sternX,
          liveGeometry.sternY,
          targetGeometry.sternX,
          targetGeometry.sternY
        );

        const angleError = headingDiff(boat.heading, activeTarget.heading);

        const collisionSpeedLimit = 1.6;

        const isRealImpact =
          showObstacles &&
          hitObstacle &&
          Math.abs(boat.speed) > collisionSpeedLimit;

        if (isRealImpact) {
          resultRef.current = "COLLISION";

          controls.throttle = 0;
          controls.rudder = 0;
          controls.bowThruster = 0;

          boat.speed = 0;

          setResult("COLLISION");
        }

        const berthTolerance =
          selectedBoat === "twinEngineCatamaran" ? 66 : 52;

        const secured =
          liveBowDistance < berthTolerance &&
          liveSternDistance < berthTolerance &&
          Math.abs(boat.speed) < 0.85 &&
          angleError < 24;

        const tooFastInBerth =
          liveBowDistance < 38 &&
          liveSternDistance < 38 &&
          Math.abs(boat.speed) >= 0.9;

        if (secured) {
          resultRef.current = "SUCCESS";
          controls.throttle = 0;
          controls.rudder = 0;
          controls.bowThruster = 0;
          boat.speed = 0;
          setResult("SUCCESS");
          setMooringLines(true);
        }

        if (tooFastInBerth) {
          resultRef.current = "FAILED";
          controls.throttle = 0;
          controls.rudder = 0;
          controls.bowThruster = 0;
          boat.speed = 0;
          setResult("FAILED");
        }
      }

      setX(boat.x);
      setY(boat.y);
      setHeading(boat.heading);
      setSpeed(boat.speed);
      setRudder(controls.rudder);
      setBowThruster(controls.bowThruster);

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frame);
  }, [
    windDirection,
    windForce,
    scenario,
    targetGeometry,
    activeTarget.heading,
    activeBoat,
    selectedBoat,
    showObstacles,
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0ea5e922,transparent_60%)]" />
        {nightMode ? <div className="absolute inset-0 bg-black/65" /> : null}
      </div>

      <section className="relative border-b border-cyan-400/10">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-20">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
            ALBATROS ULTIMATE
          </p>

          <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">
            İskele Yanaşma
            <span className="block text-cyan-300">Simulator Pro</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Marina, senaryo ve tekne tipi seçimiyle gerçekçi iskele manevra eğitimi.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[340px_1fr]">
        <aside className="rounded-[32px] border border-cyan-400/15 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-black text-cyan-300">
            Bridge Controls
          </h2>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-300">
              Marina / Sahne
            </label>

            <select
              value={selectedMarina}
              onChange={(e) => setSelectedMarina(e.target.value as MarinaKey)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none"
            >
              {Object.entries(MARINAS).map(([key, marina]) => (
                <option key={key} value={key}>
                  {marina.label}
                </option>
              ))}
            </select>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              {activeMarina.description}
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-300">
              Tekne Tipi
            </label>

            <select
              value={selectedBoat}
              onChange={(e) => setSelectedBoat(e.target.value as BoatKey)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none"
            >
              {Object.entries(BOATS).map(([key, boat]) => (
                <option key={key} value={key}>
                  {boat.label}
                </option>
              ))}
            </select>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              {activeBoat.description}
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-300">
              İskele Senaryosu
            </label>

            <select
              value={scenario}
              onChange={(e) => applyScenario(e.target.value as ScenarioKey)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none"
            >
              {Object.entries(SCENARIOS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              {activeScenario.description}
            </p>

            <div className="mt-3 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-black text-cyan-100">
              MODE: {activeScenario.difficulty}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <ControlCard title="↑ Forward Throttle" text="Basılı tut: hızlanır" />
            <ControlCard title="↓ Reverse" text="Geri manevra" />
            <ControlCard title="← → Rudder" text="Dümen etkisi hızla artar" />
            <ControlCard
              title="A / D Bow Thruster"
              text="Tekneyi yana taşımaz; başı döndürür"
            />
          </div>

          <div className="mt-6 rounded-3xl border border-sky-300/20 bg-sky-300/10 p-5">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-200">
              Wind / Drift
            </p>

            <label className="mt-5 block text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
              Wind Direction: {windDirection}°
            </label>
            <input
              type="range"
              min="0"
              max="359"
              value={windDirection}
              onChange={(e) => setWindDirection(Number(e.target.value))}
              className="mt-3 w-full"
            />

            <label className="mt-5 block text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
              Wind Force: {windForce.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1.4"
              step="0.05"
              value={windForce}
              onChange={(e) => setWindForce(Number(e.target.value))}
              className="mt-3 w-full"
            />

            <button
              type="button"
              onClick={() => resetSimulator()}
              className="mt-5 w-full rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/20"
            >
              Reset Attempt
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <ToggleButton
              label={`NIGHT ${nightMode ? "ON" : "OFF"}`}
              onClick={() => setNightMode((value) => !value)}
            />
            <ToggleButton
              label={`AIS ${aisOverlay ? "ON" : "OFF"}`}
              onClick={() => setAisOverlay((value) => !value)}
            />
            <ToggleButton
              label={`RADAR ${radarOverlay ? "ON" : "OFF"}`}
              onClick={() => setRadarOverlay((value) => !value)}
            />
            <ToggleButton
              label={`CAM ${cameraMode === "cinematic" ? "CINE" : "NORMAL"}`}
              onClick={() =>
                setCameraMode((value) =>
                  value === "normal" ? "cinematic" : "normal"
                )
              }
            />
            <ToggleButton
              label={`OBSTACLE ${showObstacles ? "ON" : "OFF"}`}
              onClick={() => setShowObstacles((value) => !value)}
            />
          </div>

          <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
            <StatusRow
              label="Heading"
              value={`${Math.round(normalizeHeading(heading))}°`}
            />
            <StatusRow label="Speed" value={speed.toFixed(2)} />
            <StatusRow
              label="Rudder"
              value={
                rudder === -1 ? "PORT" : rudder === 1 ? "STARBOARD" : "MID"
              }
            />
            <StatusRow
              label="Bow Thruster"
              value={
                bowThruster === -1
                  ? "PORT"
                  : bowThruster === 1
                    ? "STARBOARD"
                    : "OFF"
              }
            />
            <StatusRow
              label="Position"
              value={`${Math.round(x)} / ${Math.round(y)}`}
            />
            <StatusRow label="Attempt" value={String(attempts)} />
            <StatusRow
              label="Bow Distance"
              value={`${Math.round(bowDistance)} px`}
            />
            <StatusRow
              label="Stern Distance"
              value={`${Math.round(sternDistance)} px`}
            />
            <StatusRow
              label="Angle Error"
              value={`${Math.round(dockingAngleError)}°`}
            />

            <div
              className={`mt-5 rounded-2xl border p-3 text-center text-sm font-black ${
                result === "SUCCESS"
                  ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-100"
                  : result === "COLLISION" || result === "FAILED"
                    ? "border-red-300/30 bg-red-300/15 text-red-100"
                    : "border-white/10 bg-black/20 text-cyan-100"
              }`}
            >
              {dockingStatus}
            </div>
          </div>
        </aside>

        <section className="relative overflow-hidden rounded-[32px] border border-cyan-400/15 bg-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_70%)]" />

          <div className="relative z-10 h-[780px] w-full overflow-hidden">
            <div
              className="absolute inset-0 origin-center transition-transform duration-700"
              style={{ transform: `scale(${cameraScale})` }}
            >
              <img
                src={activeMarina.background}
                alt={activeMarina.label}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div
                className={`absolute inset-0 ${
                  nightMode ? "bg-black/82" : "bg-slate-950/20"
                }`}
              />

              {showObstacles
                ? OBSTACLES.map((obstacle) => (
                    <div
                      key={`${obstacle.label}-${obstacle.x}-${obstacle.y}`}
                      className="absolute z-[35] rounded-md border-2 border-red-400/80 bg-red-500/25 shadow-[0_0_18px_rgba(248,113,113,0.55)]"
                      style={{
                        left: obstacle.x,
                        top: obstacle.y,
                        width: obstacle.w,
                        height: obstacle.h,
                      }}
                      title={obstacle.label}
                    >
                      <span className="absolute left-2 top-1 rounded bg-red-950/80 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-red-100">
                        {obstacle.label}
                      </span>
                    </div>
                  ))
                : null}

              {wakeTrail.map((point) => (
                <div
                  key={point.id}
                  className="pointer-events-none absolute z-[15]"
                  style={{
                    left: point.x,
                    top: point.y,
                    opacity: Math.max(0, point.life) * 0.75,
                    transform: `translate(-50%, -50%) rotate(${point.heading}deg) scale(${
                      0.6 + (1 - point.life) * 1.6
                    })`,
                  }}
                >
                  <div
                    className="h-20 w-8 rounded-full bg-cyan-100/20 blur-md"
                    style={{ opacity: point.intensity }}
                  />
                  <div
                    className="absolute left-1/2 top-2 h-16 w-20 -translate-x-1/2 rounded-full border border-white/15"
                    style={{ opacity: point.intensity * 0.75 }}
                  />
                </div>
              ))}

              <div
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: activeTarget.x,
                  top: activeTarget.y,
                  transform: `translate(-50%, -50%) rotate(${activeTarget.heading}deg)`,
                }}
              >
                <div
                  className="rounded-[22px] border-2 border-emerald-300/80 bg-emerald-300/10 shadow-[0_0_36px_rgba(110,231,183,0.35)]"
                  style={{
                    height: activeBoat.length + 18,
                    width: activeBoat.width + 42,
                  }}
                />
                <div className="absolute left-1/2 top-[-18px] h-3 w-3 -translate-x-1/2 rounded-full bg-emerald-200 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-emerald-300/30 bg-slate-950/70 px-3 py-1 text-xs font-black text-emerald-200">
                  HEDEF İSKELE
                </div>
              </div>

              {mooringLines ? (
                <>
                  <div
                    className="absolute z-[24] h-[3px] origin-left rounded-full bg-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.65)]"
                    style={{
                      left: x,
                      top: y - 24,
                      width: 100,
                      transform: "rotate(18deg)",
                    }}
                  />
                  <div
                    className="absolute z-[24] h-[3px] origin-left rounded-full bg-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.65)]"
                    style={{
                      left: x,
                      top: y + 22,
                      width: 112,
                      transform: "rotate(-22deg)",
                    }}
                  />
                </>
              ) : null}

              <div
                className="absolute z-20"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: `translate(-50%, -50%) rotate(${heading}deg)`,
                }}
              >
                <div
                  className="absolute left-1/2 top-[58%] h-16 w-8 -translate-x-1/2 rounded-full bg-cyan-200/20 blur-md"
                  style={{
                    opacity: Math.min(0.75, Math.abs(speed) / 3),
                  }}
                />

                <div className="absolute left-1/2 top-[-12px] z-30 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.95)]" />

                {nightMode ? (
                  <>
                    <div className="absolute left-2 top-8 z-20 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.9)]" />
                    <div className="absolute right-2 top-8 z-20 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.9)]" />
                    <div className="absolute left-1/2 top-0 z-20 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_22px_rgba(255,255,255,0.95)]" />
                  </>
                ) : null}

                <img
                  src={activeBoat.image}
                  alt={activeBoat.label}
                  className="relative z-10 select-none object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.65)]"
                  style={{
                    width:
                      selectedBoat === "twinEngineCatamaran"
                        ? activeBoat.length + 80
                        : activeBoat.length + 45,
                  }}
                  draggable={false}
                />
              </div>
            </div>

            <div className="absolute right-5 top-5 z-30 rounded-2xl border border-sky-300/30 bg-slate-950/70 px-4 py-3 text-xs font-black text-sky-100 backdrop-blur">
              WIND {windDirection}° / {windForce.toFixed(2)}
            </div>

            <div className="absolute bottom-5 left-5 z-30 max-w-sm rounded-2xl border border-cyan-300/25 bg-slate-950/75 p-4 text-xs backdrop-blur">
              <p className="font-black uppercase tracking-[0.25em] text-cyan-200">
                Manevra Tavsiyesi
              </p>
              <p className="mt-3 leading-5 text-slate-200">{maneuverAdvice}</p>
            </div>

            {aisOverlay ? (
              <div className="absolute left-5 top-5 z-30 w-56 rounded-2xl border border-cyan-300/25 bg-slate-950/75 p-4 text-xs backdrop-blur">
                <p className="font-black uppercase tracking-[0.25em] text-cyan-200">
                  AIS Overlay
                </p>
                <div className="mt-3 space-y-2 text-slate-300">
                  <AISRow label="Vessel" value={activeBoat.label} />
                  <AISRow
                    label="COG"
                    value={`${Math.round(normalizeHeading(heading))}°`}
                  />
                  <AISRow label="SOG" value={Math.abs(speed).toFixed(2)} />
                  <AISRow label="Bow" value={`${Math.round(bowDistance)} px`} />
                  <AISRow
                    label="Stern"
                    value={`${Math.round(sternDistance)} px`}
                  />
                  <AISRow label="Status" value={dockingStatus} />
                </div>
              </div>
            ) : null}

            {radarOverlay ? (
              <div className="absolute bottom-5 right-5 z-30 h-44 w-44 rounded-full border border-emerald-300/35 bg-slate-950/75 p-4 backdrop-blur">
                <div className="relative h-full w-full rounded-full border border-emerald-300/20">
                  <div className="absolute left-1/2 top-0 h-full w-[1px] bg-emerald-300/20" />
                  <div className="absolute left-0 top-1/2 h-[1px] w-full bg-emerald-300/20" />
                  <div className="absolute inset-[22%] rounded-full border border-emerald-300/10" />
                  <div className="absolute inset-[36%] rounded-full border border-emerald-300/10" />

                  <div
                    className="absolute h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]"
                    style={{
                      left: `${clamp((x / 1040) * 100, 6, 92)}%`,
                      top: `${clamp((y / 720) * 100, 6, 92)}%`,
                    }}
                  />

                  <div
                    className="absolute h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]"
                    style={{
                      left: `${clamp((activeTarget.x / 1040) * 100, 6, 92)}%`,
                      top: `${clamp((activeTarget.y / 720) * 100, 6, 92)}%`,
                    }}
                  />

                  <div
                    className="absolute left-1/2 top-1/2 h-[1px] w-1/2 origin-left bg-emerald-300/40"
                    style={{
                      transform: `rotate(${heading - 90}deg)`,
                    }}
                  />
                </div>
              </div>
            ) : null}

            {result !== "RUNNING" ? (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm">
                <div
                  className={`w-[min(92%,520px)] rounded-[32px] border p-8 text-center shadow-2xl ${
                    result === "SUCCESS"
                      ? "border-emerald-300/30 bg-emerald-950/80"
                      : "border-red-300/30 bg-red-950/80"
                  }`}
                >
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-white/70">
                    Training Result
                  </p>

                  <h3 className="mt-4 text-4xl font-black text-white">
                    {result === "SUCCESS"
                      ? "İskeleye Güvenli Yanaşıldı"
                      : result === "COLLISION"
                        ? "Collision"
                        : "Failed Approach"}
                  </h3>

                  <p className="mt-4 text-slate-200">{dockingStatus}</p>

                  <button
                    type="button"
                    onClick={() => resetSimulator()}
                    className="mt-8 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/20"
                  >
                    Start New Attempt
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
}

function ControlCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-bold text-slate-200">{title}</p>
      <p className="mt-1 text-xs text-slate-400">{text}</p>
    </div>
  );
}

function ToggleButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-xs font-black text-slate-200"
    >
      {label}
    </button>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3 flex items-center justify-between">
      <span className="text-slate-300">{label}</span>
      <span className="font-black text-white">{value}</span>
    </div>
  );
}

function AISRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="font-black text-white">{value}</span>
    </div>
  );
}
