function nextColor(t: TrafficColor) {
  if (t.color() === 'red') return new Green()
  else if (t.color() === 'green') return new Yellow()
  else if (t.color() === 'yellow') return new Red()
}

class Car {
  stop() {}
  drive() {}
}

interface TrafficColor {
  color(): string;

  check(car: Car): void;
}

class Red implements TrafficColor {
  color() {
    return 'red'
  }

  check(car: Car) {
    car.stop()
  }
}

class Yellow implements TrafficColor {
  color() {
    return 'yellow'
  }

  check(car: Car) {
    car.stop()
  }
}

class Green implements TrafficColor {
  color() {
    return 'green'
  }

  check(car: Car) {
    car.drive()
  }
}