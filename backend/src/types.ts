export const TYPES = {
    // REPOSITORY
    IAuthRepository: Symbol.for("IAuthRepository"),
    IUserRepository: Symbol.for("IUserRepository"),
    IProductRepository: Symbol.for("IProductRepository"),
    ICartRepository: Symbol.for("ICartRepository"),
    IOrderRepository: Symbol.for("IOrderRepository"),
    ICategoryRepository: Symbol.for('ICategoryRepository'),
    IPaymentRepository: Symbol.for('IPaymentRepository'),


    // SERVICE
    IAuthService: Symbol.for("IAuthService"),
    IUserService: Symbol.for("IUserService"),
    IProductService: Symbol.for("IProductService"),
    ICartService: Symbol.for("ICartService"),
    IOrderService: Symbol.for("IOrderService"),
    IUploadService: Symbol.for("IUploadService"),
    ICategoryService: Symbol.for('ICategoryService'),
    IPaymentService: Symbol.for("IPaymentService"),

}