import { 
    Body, 
    Controller, 
    Post, 
    UseGuards,
    Request,
    Get,
    Param
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dtos/req/create-payment.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PaymentCallbackRequestDto } from './dtos/req/payment-callback.dto';

interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        email: string;
        role: string;
    };
}


@Controller('payment')
@UseGuards( RolesGuard)
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post('create')
    @UseGuards(JwtGuard)
    @Roles('USER', 'ADMIN')
    async createPayment(
        @Body() createPaymentDto: CreatePaymentDto,
        @Request() req: AuthenticatedRequest
    ) {
        // Ensure user is authenticated
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        
        return this.paymentService.createPayment(createPaymentDto);
    }
    
    @Post('callback')
    async handleCallback(@Body() paymentCallbackRequestDto: PaymentCallbackRequestDto) {
        return this.paymentService.handleCallback(paymentCallbackRequestDto);
    }

    @Get('status/:orderId')
    @UseGuards(JwtGuard)
    @Roles('USER', 'ADMIN')
    async checkPaymentStatus(
        @Param('orderId') orderId: string,
        @Request() req: AuthenticatedRequest
    ) {
        // Ensure user is authenticated
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        
        return this.paymentService.checkPaymentStatus(orderId);
    }
}
