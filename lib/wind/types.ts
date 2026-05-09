export type Scenario =
  | "marina"
  | "openSea"
  | "anchorage"
  | "sailTraining"
  | "harbourApproach"
  | "nightWatch";

export type RelativeWindType =
  | "headwind"
  | "portBow"
  | "starboardBow"
  | "portBeam"
  | "starboardBeam"
  | "portQuarter"
  | "starboardQuarter"
  | "following";

export type BeaufortData = {
  force: number;
  name: string;
  knotRange: string;
  description: string;
};

export type SeaStateData = {
  label: string;
  detail: string;
  trainingView: string;
};

export type WindsockState = {
  extensionPercent: number;
  droopPercent: number;
  swayAmplitude: number;
  turbulence: number;
  label: string;
};

export type CaptainDecision = {
  status: "Training Suitable" | "Caution" | "Advanced Handling" | "Restricted";
  summary: string;
  marinaNote: string;
  sailingNote: string;
  anchorageNote: string;
};

export type CompassInfo = {
  directionLabel: string;
  cardinalLabel: string;
  relativeWind: RelativeWindType;
};