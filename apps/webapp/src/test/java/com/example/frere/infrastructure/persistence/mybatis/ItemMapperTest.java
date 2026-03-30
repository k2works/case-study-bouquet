package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.item.Item;
import com.example.frere.domain.model.supplier.Supplier;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@MybatisTest
class ItemMapperTest {

    @Autowired
    private ItemMapper itemMapper;

    @Autowired
    private SupplierMapper supplierMapper;

    private Long supplierId;

    @BeforeEach
    void setUp() {
        // FK 親テーブル: 仕入先を先に登録
        Supplier supplier = new Supplier();
        supplier.setSupplierName("テスト仕入先");
        supplier.setPhone("03-0000-0000");
        supplier.setEmail("item-test-supplier@example.com");
        supplier.setAddress("東京都テスト区");
        supplierMapper.insert(supplier);
        supplierId = supplier.getSupplierId();
    }

    @Test
    void findAll_データが存在する場合_全件取得できる() {
        // Given: 単品が登録されている
        Item item = createItem("赤バラ", 7, new BigDecimal("300"));
        itemMapper.insert(item);

        // When: 全件取得する
        List<Item> items = itemMapper.findAll();

        // Then: 登録した単品が含まれる
        assertThat(items).isNotEmpty();
        assertThat(items).anyMatch(i -> "赤バラ".equals(i.getItemName()));
    }

    @Test
    void findById_存在するIDの場合_単品が取得できる() {
        // Given: 単品が登録されている
        Item item = createItem("白ユリ", 5, new BigDecimal("500"));
        itemMapper.insert(item);
        Long itemId = item.getItemId();

        // When: IDで検索する
        Item found = itemMapper.findById(itemId);

        // Then: 一致する単品が返る
        assertThat(found).isNotNull();
        assertThat(found.getItemName()).isEqualTo("白ユリ");
        assertThat(found.getSupplierId()).isEqualTo(supplierId);
        assertThat(found.getQualityRetentionDays()).isEqualTo(5);
        assertThat(found.getUnitPrice()).isEqualByComparingTo(new BigDecimal("500"));
    }

    @Test
    void findById_存在しないIDの場合_nullが返る() {
        // Given: 存在しないID
        Long nonExistentId = 99999L;

        // When: IDで検索する
        Item found = itemMapper.findById(nonExistentId);

        // Then: nullが返る
        assertThat(found).isNull();
    }

    @Test
    void insert_正常なデータの場合_登録できる() {
        // Given: 新規単品データ
        Item item = createItem("ピンクカーネーション", 10, new BigDecimal("200"));

        // When: 登録する
        itemMapper.insert(item);

        // Then: IDが自動採番され、findByIdで取得できる
        assertThat(item.getItemId()).isNotNull();
        Item found = itemMapper.findById(item.getItemId());
        assertThat(found.getItemName()).isEqualTo("ピンクカーネーション");
        assertThat(found.getSupplierId()).isEqualTo(supplierId);
    }

    @Test
    void update_既存データの場合_更新できる() {
        // Given: 単品が登録されている
        Item item = createItem("黄チューリップ", 3, new BigDecimal("150"));
        itemMapper.insert(item);

        // When: 仕入単価と品質維持日数を更新する
        item.setUnitPrice(new BigDecimal("180"));
        item.setQualityRetentionDays(4);
        itemMapper.update(item);

        // Then: 更新が反映される
        Item found = itemMapper.findById(item.getItemId());
        assertThat(found.getUnitPrice()).isEqualByComparingTo(new BigDecimal("180"));
        assertThat(found.getQualityRetentionDays()).isEqualTo(4);
        assertThat(found.getItemName()).isEqualTo("黄チューリップ");
    }

    @Test
    void deleteById_既存データの場合_削除できる() {
        // Given: 単品が登録されている
        Item item = createItem("紫スミレ", 6, new BigDecimal("100"));
        itemMapper.insert(item);
        Long itemId = item.getItemId();

        // When: 削除する
        itemMapper.deleteById(itemId);

        // Then: 取得できなくなる
        Item found = itemMapper.findById(itemId);
        assertThat(found).isNull();
    }

    private Item createItem(String itemName, int qualityRetentionDays, BigDecimal unitPrice) {
        Item item = new Item();
        item.setItemName(itemName);
        item.setSupplierId(supplierId);
        item.setQualityRetentionDays(qualityRetentionDays);
        item.setUnitPrice(unitPrice);
        return item;
    }
}
