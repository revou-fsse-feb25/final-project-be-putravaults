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

interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        email: string;
        role: string;
    };
}

@Controller('payment')
@UseGuards(JwtGuard, RolesGuard)
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post('create')
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

    @Get('status/:orderId')
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
