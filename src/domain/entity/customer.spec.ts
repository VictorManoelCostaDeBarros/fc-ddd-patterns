import Address from "./address"
import Customer from "./customer"

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "John")
    }).toThrowError("Id is required")
  }) 

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "")
    }).toThrowError("Name is required")
  }) 

  it("should change name", () => {
    const customer = new Customer("123", "Victor")

    customer.changeName("John")
    expect(customer.name).toBe("John")
  }) 

  it("should not change name to a empty string", () => {
    const customer = new Customer("123", "Victor")

    expect(() => {
      customer.changeName("")
    }).toThrowError("Name is required")
  }) 

  it("should activate customer", () => {
    const customer = new Customer("123", "Customer 1")
    const address = new Address("Street 1", 123, "08191-335", "São Paulo")
    customer.Address = address

    customer.activate()

    expect(customer.isActive()).toBe(true)
  }) 

  it("should not be able to activate customer without an address", () => {
    const customer = new Customer("123", "Customer 1")

    expect(() => {
      customer.activate()
    }).toThrowError("Address is mandatory to activate a customer")
  }) 

  it("should deactivate customer", () => {
    const customer = new Customer("123", "Customer 1")

    customer.deactivate()

    expect(customer.isActive()).toBe(false)
  }) 

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1")
    expect(customer.rewardPoints).toBe(0)

    customer.addRewardPoints(10)
    expect(customer.rewardPoints).toBe(10)

    customer.addRewardPoints(10)
    expect(customer.rewardPoints).toBe(20)
  })
})