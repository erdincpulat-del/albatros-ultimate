import { lerp } from "../utils/lerp";

export function updatePhysics(state: any, input: any, dt: number) {
  const targetHeading = input.heading;

  // inertia turn
  state.heading = lerp(state.heading, targetHeading, dt * 0.8);

  // acceleration
  const acceleration = input.force * 0.5;

  // damping
  state.speed = lerp(state.speed, state.speed + acceleration, dt * 0.5);

  // friction
  state.speed *= 0.98;

  return state;
}