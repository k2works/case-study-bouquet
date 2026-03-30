package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.customer.Customer;
import com.example.frere.domain.model.destination.DeliveryDestination;
import com.example.frere.domain.model.order.Order;
import com.example.frere.domain.model.order.OrderStatus;
import com.example.frere.domain.model.product.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@MybatisTest
class OrderMapperTest {

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private CustomerMapper customerMapper;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private DeliveryDestinationMapper deliveryDestinationMapper;

    private Long customerId;
    private Long productId;
    private Long destinationId;

    @BeforeEach
    void setUp() {
        // FK 親テーブル: 得意先を登録
        Customer customer = new Customer();
        customer.setName("受注テスト得意先");
        customer.setEmail("order-test@example.com");
        customer.setPasswordHash("hashed_password");
        customer.setPhone("090-0000-0000");
        customer.setAddress("東京都テスト区");
        customerMapper.insert(customer);
        customerId = customer.getCustomerId();

        // FK 親テーブル: 商品を登録
        Product product = new Product();
        product.setProductName("受注テスト花束");
        product.setDescription("受注テスト用");
        product.setPrice(new BigDecimal("5000"));
        product.setIsActive(true);
        productMapper.insert(product);
        productId = product.getProductId();

        // FK 親テーブル: 届け先を登録
        DeliveryDestination dest = new DeliveryDestination();
        dest.setCustomerId(customerId);
        dest.setName("受注テスト届け先");
        dest.setPhone("080-1111-2222");
        dest.setPostalCode("100-0001");
        dest.setAddress("東京都千代田区");
        deliveryDestinationMapper.insert(dest);
        destinationId = dest.getDestinationId();
    }

    @Test
    void findAll_データが存在する場合_全件取得できる() {
        // Given: 受注が登録されている
        Order order = createOrder(
                LocalDate.of(2026, 4, 10),
                LocalDate.of(2026, 4, 9),
                "お誕生日おめでとう",
                OrderStatus.ORDERED,
                LocalDate.of(2026, 3, 30),
                new BigDecimal("5000"));
        orderMapper.insert(order);

        // When: 全件取得する
        List<Order> orders = orderMapper.findAll();

        // Then: 登録した受注が含まれる
        assertThat(orders).isNotEmpty();
    }

    @Test
    void findById_存在するIDの場合_受注が取得できる() {
        // Given: 受注が登録されている
        Order order = createOrder(
                LocalDate.of(2026, 4, 15),
                LocalDate.of(2026, 4, 14),
                "ご結婚おめでとうございます",
                OrderStatus.ORDERED,
                LocalDate.of(2026, 3, 30),
                new BigDecimal("5000"));
        orderMapper.insert(order);
        Long orderId = order.getOrderId();

        // When: IDで検索する
        Order found = orderMapper.findById(orderId);

        // Then: 一致する受注が返る
        assertThat(found).isNotNull();
        assertThat(found.getCustomerId()).isEqualTo(customerId);
        assertThat(found.getProductId()).isEqualTo(productId);
        assertThat(found.getDestinationId()).isEqualTo(destinationId);
        assertThat(found.getDeliveryDate()).isEqualTo(LocalDate.of(2026, 4, 15));
        assertThat(found.getShippingDate()).isEqualTo(LocalDate.of(2026, 4, 14));
        assertThat(found.getMessage()).isEqualTo("ご結婚おめでとうございます");
        assertThat(found.getOrderStatus()).isEqualTo(OrderStatus.ORDERED);
        assertThat(found.getOrderDate()).isEqualTo(LocalDate.of(2026, 3, 30));
        assertThat(found.getTotalAmount()).isEqualByComparingTo(new BigDecimal("5000"));
    }

    @Test
    void findById_存在しないIDの場合_nullが返る() {
        // Given: 存在しないID
        Long nonExistentId = 99999L;

        // When: IDで検索する
        Order found = orderMapper.findById(nonExistentId);

        // Then: nullが返る
        assertThat(found).isNull();
    }

    @Test
    void insert_メッセージがnullの場合_登録できる() {
        // Given: メッセージなしの受注データ（message は NULL 許容）
        Order order = createOrder(
                LocalDate.of(2026, 5, 1),
                LocalDate.of(2026, 4, 30),
                null,
                OrderStatus.ORDERED,
                LocalDate.of(2026, 3, 30),
                new BigDecimal("5000"));

        // When: 登録する
        orderMapper.insert(order);

        // Then: 登録が成功し、messageはnullのまま
        Order found = orderMapper.findById(order.getOrderId());
        assertThat(found).isNotNull();
        assertThat(found.getMessage()).isNull();
    }

    @Test
    void insert_正常なデータの場合_登録できる() {
        // Given: 新規受注データ
        Order order = createOrder(
                LocalDate.of(2026, 4, 20),
                LocalDate.of(2026, 4, 19),
                "いつもありがとう",
                OrderStatus.ORDERED,
                LocalDate.of(2026, 3, 30),
                new BigDecimal("5000"));

        // When: 登録する
        orderMapper.insert(order);

        // Then: IDが自動採番され、findByIdで取得できる
        assertThat(order.getOrderId()).isNotNull();
        Order found = orderMapper.findById(order.getOrderId());
        assertThat(found.getMessage()).isEqualTo("いつもありがとう");
    }

    @Test
    void update_ステータスを変更できる() {
        // Given: 受注済みの受注が登録されている
        Order order = createOrder(
                LocalDate.of(2026, 4, 25),
                LocalDate.of(2026, 4, 24),
                "テスト",
                OrderStatus.ORDERED,
                LocalDate.of(2026, 3, 30),
                new BigDecimal("5000"));
        orderMapper.insert(order);

        // When: ステータスを出荷準備中に更新する
        order.setOrderStatus(OrderStatus.PREPARING);
        orderMapper.update(order);

        // Then: 更新が反映される
        Order found = orderMapper.findById(order.getOrderId());
        assertThat(found.getOrderStatus()).isEqualTo(OrderStatus.PREPARING);
    }

    @Test
    void update_届け日を変更できる() {
        // Given: 受注が登録されている
        Order order = createOrder(
                LocalDate.of(2026, 4, 10),
                LocalDate.of(2026, 4, 9),
                "テスト",
                OrderStatus.ORDERED,
                LocalDate.of(2026, 3, 30),
                new BigDecimal("5000"));
        orderMapper.insert(order);

        // When: 届け日と出荷日を変更する（BR02: 出荷日 = 届け日 - 1日）
        order.setDeliveryDate(LocalDate.of(2026, 4, 20));
        order.setShippingDate(LocalDate.of(2026, 4, 19));
        order.setOrderStatus(OrderStatus.DELIVERY_DATE_CHANGED);
        orderMapper.update(order);

        // Then: 更新が反映される
        Order found = orderMapper.findById(order.getOrderId());
        assertThat(found.getDeliveryDate()).isEqualTo(LocalDate.of(2026, 4, 20));
        assertThat(found.getShippingDate()).isEqualTo(LocalDate.of(2026, 4, 19));
        assertThat(found.getOrderStatus()).isEqualTo(OrderStatus.DELIVERY_DATE_CHANGED);
    }

    @Test
    void deleteById_既存データの場合_削除できる() {
        // Given: 受注が登録されている
        Order order = createOrder(
                LocalDate.of(2026, 4, 30),
                LocalDate.of(2026, 4, 29),
                "削除テスト",
                OrderStatus.ORDERED,
                LocalDate.of(2026, 3, 30),
                new BigDecimal("5000"));
        orderMapper.insert(order);
        Long orderId = order.getOrderId();

        // When: 削除する
        orderMapper.deleteById(orderId);

        // Then: 取得できなくなる
        Order found = orderMapper.findById(orderId);
        assertThat(found).isNull();
    }

    private Order createOrder(LocalDate deliveryDate, LocalDate shippingDate, String message,
                              OrderStatus orderStatus, LocalDate orderDate, BigDecimal totalAmount) {
        Order order = new Order();
        order.setCustomerId(customerId);
        order.setProductId(productId);
        order.setDestinationId(destinationId);
        order.setDeliveryDate(deliveryDate);
        order.setShippingDate(shippingDate);
        order.setMessage(message);
        order.setOrderStatus(orderStatus);
        order.setOrderDate(orderDate);
        order.setTotalAmount(totalAmount);
        return order;
    }
}
