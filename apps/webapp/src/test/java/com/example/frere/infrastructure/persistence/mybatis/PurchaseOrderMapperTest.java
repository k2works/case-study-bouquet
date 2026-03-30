package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.item.Item;
import com.example.frere.domain.model.purchaseorder.PurchaseOrder;
import com.example.frere.domain.model.purchaseorder.PurchaseOrderStatus;
import com.example.frere.domain.model.supplier.Supplier;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@MybatisTest
class PurchaseOrderMapperTest {

    @Autowired
    private PurchaseOrderMapper purchaseOrderMapper;

    @Autowired
    private ItemMapper itemMapper;

    @Autowired
    private SupplierMapper supplierMapper;

    private Long itemId;
    private Long supplierId;

    @BeforeEach
    void setUp() {
        // FK 親テーブル: 仕入先を登録
        Supplier supplier = new Supplier();
        supplier.setSupplierName("発注テスト仕入先");
        supplier.setPhone("03-0000-0000");
        supplier.setEmail("po-test@example.com");
        supplier.setAddress("東京都テスト区");
        supplierMapper.insert(supplier);
        supplierId = supplier.getSupplierId();

        // FK 親テーブル: 単品を登録
        Item item = new Item();
        item.setItemName("発注テスト赤バラ");
        item.setSupplierId(supplierId);
        item.setQualityRetentionDays(7);
        item.setUnitPrice(new BigDecimal("300"));
        itemMapper.insert(item);
        itemId = item.getItemId();
    }

    @Test
    void findAll_データが存在する場合_全件取得できる() {
        // Given: 発注が登録されている
        PurchaseOrder po = createPurchaseOrder(100, PurchaseOrderStatus.ORDERED,
                LocalDate.of(2026, 3, 30), LocalDate.of(2026, 4, 2));
        purchaseOrderMapper.insert(po);

        // When: 全件取得する
        List<PurchaseOrder> purchaseOrders = purchaseOrderMapper.findAll();

        // Then: 登録した発注が含まれる
        assertThat(purchaseOrders).isNotEmpty();
    }

    @Test
    void findById_存在するIDの場合_発注が取得できる() {
        // Given: 発注が登録されている
        PurchaseOrder po = createPurchaseOrder(50, PurchaseOrderStatus.ORDERED,
                LocalDate.of(2026, 3, 30), LocalDate.of(2026, 4, 3));
        purchaseOrderMapper.insert(po);
        Long purchaseOrderId = po.getPurchaseOrderId();

        // When: IDで検索する
        PurchaseOrder found = purchaseOrderMapper.findById(purchaseOrderId);

        // Then: 一致する発注が返る
        assertThat(found).isNotNull();
        assertThat(found.getItemId()).isEqualTo(itemId);
        assertThat(found.getSupplierId()).isEqualTo(supplierId);
        assertThat(found.getQuantity()).isEqualTo(50);
        assertThat(found.getPurchaseOrderStatus()).isEqualTo(PurchaseOrderStatus.ORDERED);
        assertThat(found.getOrderDate()).isEqualTo(LocalDate.of(2026, 3, 30));
        assertThat(found.getExpectedArrivalDate()).isEqualTo(LocalDate.of(2026, 4, 3));
    }

    @Test
    void findById_存在しないIDの場合_nullが返る() {
        // Given: 存在しないID
        Long nonExistentId = 99999L;

        // When: IDで検索する
        PurchaseOrder found = purchaseOrderMapper.findById(nonExistentId);

        // Then: nullが返る
        assertThat(found).isNull();
    }

    @Test
    void insert_正常なデータの場合_登録できる() {
        // Given: 新規発注データ
        PurchaseOrder po = createPurchaseOrder(200, PurchaseOrderStatus.ORDERED,
                LocalDate.of(2026, 4, 1), LocalDate.of(2026, 4, 5));

        // When: 登録する
        purchaseOrderMapper.insert(po);

        // Then: IDが自動採番され、findByIdで取得できる
        assertThat(po.getPurchaseOrderId()).isNotNull();
        PurchaseOrder found = purchaseOrderMapper.findById(po.getPurchaseOrderId());
        assertThat(found.getQuantity()).isEqualTo(200);
    }

    @Test
    void update_ステータスを入荷済みに変更できる() {
        // Given: 発注済みの発注が登録されている
        PurchaseOrder po = createPurchaseOrder(30, PurchaseOrderStatus.ORDERED,
                LocalDate.of(2026, 3, 28), LocalDate.of(2026, 4, 1));
        purchaseOrderMapper.insert(po);

        // When: ステータスを入荷済みに更新する
        po.setPurchaseOrderStatus(PurchaseOrderStatus.ARRIVED);
        purchaseOrderMapper.update(po);

        // Then: 更新が反映される
        PurchaseOrder found = purchaseOrderMapper.findById(po.getPurchaseOrderId());
        assertThat(found.getPurchaseOrderStatus()).isEqualTo(PurchaseOrderStatus.ARRIVED);
    }

    @Test
    void deleteById_既存データの場合_削除できる() {
        // Given: 発注が登録されている
        PurchaseOrder po = createPurchaseOrder(10, PurchaseOrderStatus.ORDERED,
                LocalDate.of(2026, 3, 25), LocalDate.of(2026, 3, 28));
        purchaseOrderMapper.insert(po);
        Long purchaseOrderId = po.getPurchaseOrderId();

        // When: 削除する
        purchaseOrderMapper.deleteById(purchaseOrderId);

        // Then: 取得できなくなる
        PurchaseOrder found = purchaseOrderMapper.findById(purchaseOrderId);
        assertThat(found).isNull();
    }

    private PurchaseOrder createPurchaseOrder(int quantity, PurchaseOrderStatus status,
                                               LocalDate orderDate, LocalDate expectedArrivalDate) {
        PurchaseOrder po = new PurchaseOrder();
        po.setItemId(itemId);
        po.setSupplierId(supplierId);
        po.setQuantity(quantity);
        po.setPurchaseOrderStatus(status);
        po.setOrderDate(orderDate);
        po.setExpectedArrivalDate(expectedArrivalDate);
        return po;
    }
}
