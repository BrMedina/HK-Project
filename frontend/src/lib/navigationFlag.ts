let fromDashboard = false;

export function markFromDashboard() {
  fromDashboard = true;
}

export function consumeFromDashboard() {
  const v = fromDashboard;
  fromDashboard = false;
  return v;
}

export default { markFromDashboard, consumeFromDashboard };
