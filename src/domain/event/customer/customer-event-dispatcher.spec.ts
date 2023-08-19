import { Sequelize } from "sequelize-typescript"
import EventDispatcher from "../../@shared/event/event-dispatcher";
import SendConsoleWhenCustomerIsCreated1Handler from "../../customer/event/handler/send-console-when-customer-is-created-1.handler";
import SendConsoleWhenCustomerIsCreated2Handler from "../../customer/event/handler/send-console-when-customer-is-created-2.handler";
import Customer from "../../customer/entity/customer";
import Address from "../../customer/value-object/address";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendConsoleWhenAddressIsChangedHandler from "../../customer/event/handler/send-console-when-address-is-changed.handler";
import AddressChangedEvent from "../../customer/event/address-changed.event";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";


describe("Customer Event Dispatcher", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  
  it("should notify when a new customer is created", async () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler1 = new SendConsoleWhenCustomerIsCreated1Handler()
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle")

    const eventHandler2 = new SendConsoleWhenCustomerIsCreated2Handler()
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle")

    eventDispatcher.register(
      "CustomerCreatedEvent",
      eventHandler1
    )

    eventDispatcher.register(
      "CustomerCreatedEvent",
      eventHandler2
    )

    const customerRepository = new CustomerRepository()
    const customer = new Customer("1", "Customer 1")
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1")
    customer.changeAddress(address)

    await customerRepository.create(customer)

    const customerCreatedEvent = new CustomerCreatedEvent(customer)

    eventDispatcher.notify(customerCreatedEvent)

    expect(spyEventHandler1).toHaveBeenCalled()
    expect(spyEventHandler2).toHaveBeenCalled()
  })

  it("should notify when a address is changed", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleWhenAddressIsChangedHandler()
    const spyEventHandler = jest.spyOn(eventHandler, "handle")

    eventDispatcher.register("AddressChangedEvent", eventHandler)

    const customer = new Customer("1", "Customer 1")
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1")

    customer.changeAddress(address)

    const addressChangedEvent = new AddressChangedEvent(customer)

    eventDispatcher.notify(addressChangedEvent)

    expect(spyEventHandler).toHaveBeenCalled()
  })
})