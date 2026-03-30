package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.arrival.Arrival;
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
class ArrivalMapperTest {

    @Autowired
    private ArrivalMapper arrivalMapper;

    @Autowired
    private PurchaseOrderMapper purchaseOrderMapper;

    @Autowired
    private ItemMapper itemMapper;

    @Autowired
    private SupplierMapper supplierMapper;

    private Long purchaseOrderId;
    private Long itemId;

    @BeforeEach
    void setUp() {
        // FK 親テーブル: 仕入先 → 単品 → 発注の順に登録
        Supplier supplier = new Supplier();
        supplier.setSupplierName("入荷テスト仕入先");
        supplier.setPhone("03-0000-0000");
        supplier.setEmail("arrival-test@example.com");
        supplier.setAddress("東京都テスト区");
        supplierMapper.insert(supplier);

        Item item = new Item();
        item.setItemName("入荷テスト赤バラ");
        item.setSupplierId(supplier.getSupplierId());
        item.setQualityRetentionDays(7);
        item.setUnitPrice(new BigDecimal("300"));
        itemMapper.insert(item);
        itemId = item.getItemId();

        PurchaseOrder po = new PurchaseOrder();
        po.setItemId(itemId);
        po.setSupplierId(supplier.getSupplierId());
        po.setQuantity(100);
        po.setPurchaseOrderStatus(PurchaseOrderStatus.ORDERED);
        po.setOrderDate(LocalDate.of(2026, 3, 25));
        po.setExpectedArrivalDate(LocalDate.of(2026, 3, 28));
        purchaseOrderMapper.insert(po);
        purchaseOrderId = po.getPurchaseOrderId();
    }

    @Test
    void findAll_データが存在する場合_全件取得できる() {
        // Given: 入荷が登録されている
        Arrival arrival = createArrival(100, LocalDate.of(2026, 3, 28));
        arrivalMapper.insert(arrival);

        // When: 全件取得する
        List<Arrival> arrivals = arrivalMapper.findAll();

        // Then: 登録した入荷が含まれる
        assertThat(arrivals).isNotEmpty();
    }

    @Test
    void findById_存在するIDの場合_入荷が取得できる() {
        // Given: 入荷が登録されている
        Arrival arrival = createArrival(50, LocalDate.of(2026, 3, 29));
        arrivalMapper.insert(arrival);
        Long arrivalId = arrival.getArrivalId();

        // When: IDで検索する
        Arrival found = arrivalMapper.findById(arrivalId);

        // Then: 一致する入荷が返る
        assertThat(found).isNotNull();
        assertThat(found.getPurchaseOrderId()).isEqualTo(purchaseOrderId);
        assertThat(found.getItemId()).isEqualTo(itemId);
        assertThat(found.getQuantity()).isEqualTo(50);
        assertThat(found.getArrivalDate()).isEqualTo(LocalDate.of(2026, 3, 29));
    }

    @Test
    void findById_存在しないIDの場合_nullが返る() {
        // Given: 存在しないID
        Long nonExistentId = 99999L;

        // When: IDで検索する
        Arrival found = arrivalMapper.findById(nonExistentId);

        // Then: nullが返る
        assertThat(found).isNull();
    }

    @Test
    void insert_正常なデータの場合_登録できる() {
        // Given: 新規入荷データ
        Arrival arrival = createArrival(75, LocalDate.of(2026, 3, 30));

        // When: 登録する
        arrivalMapper.insert(arrival);

        // Then: IDが自動採番され、findByIdで取得できる
        assertThat(arrival.getArrivalId()).isNotNull();
        Arrival found = arrivalMapper.findById(arrival.getArrivalId());
        assertThat(found.getQuantity()).isEqualTo(75);
        assertThat(found.getArrivalDate()).isEqualTo(LocalDate.of(2026, 3, 30));
    }

    @Test
    void update_既存データの場合_更新できる() {
        // Given: 入荷が登録されている
        Arrival arrival = createArrival(80, LocalDate.of(2026, 4, 1));
        arrivalMapper.insert(arrival);

        // When: 数量を更新する
        arrival.setQuantity(90);
        arrivalMapper.update(arrival);

        // Then: 更新が反映される
        Arrival found = arrivalMapper.findById(arrival.getArrivalId());
        assertThat(found.getQuantity()).isEqualTo(90);
    }

    @Test
    void deleteById_既存データの場合_削除できる() {
        // Given: 入荷が登録されている
        Arrival arrival = createArrival(60, LocalDate.of(2026, 4, 2));
        arrivalMapper.insert(arrival);
        Long arrivalId = arrival.getArrivalId();

        // When: 削除する
        arrivalMapper.deleteById(arrivalId);

        // Then: 取得できなくなる
        Arrival found = arrivalMapper.findById(arrivalId);
        assertThat(found).isNull();
    }

    private Arrival createArrival(int quantity, LocalDate arrivalDate) {
        Arrival arrival = new Arrival();
        arrival.setPurchaseOrderId(purchaseOrderId);
        arrival.setItemId(itemId);
        arrival.setQuantity(quantity);
        arrival.setArrivalDate(arrivalDate);
        return arrival;
    }
}
