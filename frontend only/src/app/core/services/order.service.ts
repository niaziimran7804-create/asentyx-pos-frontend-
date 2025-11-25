import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Order, OrderCreateRequest, WhatsAppMessage } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  private mockOrders: Order[] = [];

  constructor() {}

  createOrder(request: OrderCreateRequest): Observable<Order> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const newOrder: Order = {
          id: (this.mockOrders.length + 1).toString(),
          productId: request.productId,
          productName: 'Product Name', // Would be fetched from product service
          categoryId: '1',
          categoryName: 'Category Name',
          currentStock: 0,
          desiredQuantity: request.desiredQuantity,
          dealerId: request.dealerId,
          dealerName: 'Dealer Name',
          dealerWhatsApp: '+1234567890',
          status: 'PENDING',
          notes: request.notes,
          createdAt: new Date()
        };
        this.mockOrders.unshift(newOrder);
        this.ordersSubject.next(this.mockOrders);
        return newOrder;
      })
    );
  }

  getAllOrders(): Observable<Order[]> {
    return of(this.mockOrders).pipe(delay(300));
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return of(this.mockOrders.find(o => o.id === id)).pipe(delay(200));
  }

  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const order = this.mockOrders.find(o => o.id === orderId);
        if (!order) throw new Error('Order not found');
        
        order.status = status;
        if (status === 'SENT') order.sentAt = new Date();
        if (status === 'RECEIVED') order.receivedAt = new Date();
        
        this.ordersSubject.next(this.mockOrders);
        return order;
      })
    );
  }

  generateWhatsAppMessage(order: Order, storeName: string = 'ABC Mart'): WhatsAppMessage {
    const message = `Hello, I want to order:
- Product: ${order.productName}
- Quantity: ${order.desiredQuantity}
- Category: ${order.categoryName}
- Store: ${storeName}

Current Stock: ${order.currentStock}
${order.notes ? `Notes: ${order.notes}` : ''}

Thank you!`;

    return {
      dealerNumber: order.dealerWhatsApp,
      message
    };
  }

  sendWhatsAppOrder(order: Order, storeName?: string): string {
    const whatsappMsg = this.generateWhatsAppMessage(order, storeName);
    const encodedMessage = encodeURIComponent(whatsappMsg.message);
    const phoneNumber = whatsappMsg.dealerNumber.replace('+', '');
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }

  deleteOrder(orderId: string): Observable<boolean> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const index = this.mockOrders.findIndex(o => o.id === orderId);
        if (index === -1) throw new Error('Order not found');
        
        this.mockOrders.splice(index, 1);
        this.ordersSubject.next(this.mockOrders);
        return true;
      })
    );
  }
}
