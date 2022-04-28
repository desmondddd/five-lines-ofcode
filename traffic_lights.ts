function nextColor(t: TrafficColor) {
  t.nextColor()
}

class Car {
  stop() { }
  drive() { }
}

interface Color {
  check(car: Car): void
  nextColor(t: TrafficColor): TrafficColor
}

class Red implements Color {
  check(car: Car): void {
    car.stop()
  }

  nextColor(t: TrafficColor): TrafficColor {
      return new TrafficColor(new Green())
  }
}

class Yellow implements Color {
  check(car: Car): void {
    car.stop()
  }

  nextColor(t: TrafficColor): TrafficColor {
    return new TrafficColor(new Red())
}
}

class Green implements Color {
  check(car: Car): void {
    car.drive()
  }

  nextColor(t: TrafficColor): TrafficColor {
    return new TrafficColor(new Yellow())
}
}

class TrafficColor {
  constructor(private col: Color) { }

  color() { return this.col }

  check(car: Car) {
    this.col.check(car)
  }

  nextColor(): TrafficColor {
    return this.col.nextColor(this)
  }
}