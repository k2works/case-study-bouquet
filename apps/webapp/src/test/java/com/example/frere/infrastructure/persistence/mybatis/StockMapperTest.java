package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.item.Item;
import com.example.frere.domain.model.stock.Stock;
import com.example.frere.domain.model.stock.StockStatus;
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
class StockMapperTest {

    @Autowired
    private StockMapper stockMapper;

    @Autowired
    private ItemMapper itemMapper;

    @Autowired
    private SupplierMapper supplierMapper;

    private Long itemId;

    @BeforeEach
    void setUp() {
        // FK 親テーブル: 仕入先 → 単品の順に登録
        Supplier supplier = new Supplier();
        supplier.setSupplierName("在庫テスト仕入先");
        supplier.setPhone("03-0000-0000");
        supplier.setEmail("stock-test@example.com");
        supplier.setAddress("東京都テスト区");
        supplierMapper.insert(supplier);

        Item item = new Item();
        item.setItemName("在庫テスト赤バラ");
        item.setSupplierId(supplier.getSupplierId());
        item.setQualityRetentionDays(7);
        item.setUnitPrice(new BigDecimal("300"));
        itemMapper.insert(item);
        itemId = item.getItemId();
    }

    @Test
    void findAll_データが存在する場合_全件取得できる() {
        // Given: 在庫が登録されている
        Stock stock = createStock(100, LocalDate.of(2026, 3, 28),
                LocalDate.of(2026, 4, 4), StockStatus.ARRIVED);
        stockMapper.insert(stock);

        // When: 全件取得する
        List<Stock> stocks = stockMapper.findAll();

        // Then: 登録した在庫が含まれる
        assertThat(stocks).isNotEmpty();
    }

    @Test
    void findById_存在するIDの場合_在庫が取得できる() {
        // Given: 在庫が登録されている
        Stock stock = createStock(50, LocalDate.of(2026, 3, 29),
                LocalDate.of(2026, 4, 5), StockStatus.ARRIVED);
        stockMapper.insert(stock);
        Long stockId = stock.getStockId();

        // When: IDで検索する
        Stock found = stockMapper.findById(stockId);

        // Then: 一致する在庫が返る
        assertThat(found).isNotNull();
        assertThat(found.getItemId()).isEqualTo(itemId);
        assertThat(found.getQuantity()).isEqualTo(50);
        assertThat(found.getArrivalDate()).isEqualTo(LocalDate.of(2026, 3, 29));
        assertThat(found.getExpiryDate()).isEqualTo(LocalDate.of(2026, 4, 5));
        assertThat(found.getStockStatus()).isEqualTo(StockStatus.ARRIVED);
    }

    @Test
    void findById_存在しないIDの場合_nullが返る() {
        // Given: 存在しないID
        Long nonExistentId = 99999L;

        // When: IDで検索する
        Stock found = stockMapper.findById(nonExistentId);

        // Then: nullが返る
        assertThat(found).isNull();
    }

    @Test
    void insert_正常なデータの場合_登録できる() {
        // Given: 新規在庫データ
        Stock stock = createStock(200, LocalDate.of(2026, 3, 30),
                LocalDate.of(2026, 4, 6), StockStatus.ARRIVED);

        // When: 登録する
        stockMapper.insert(stock);

        // Then: IDが自動採番され、findByIdで取得できる
        assertThat(stock.getStockId()).isNotNull();
        Stock found = stockMapper.findById(stock.getStockId());
        assertThat(found.getQuantity()).isEqualTo(200);
    }

    @Test
    void update_ステータスを使用済みに変更できる() {
        // Given: 入荷済みの在庫が登録されている
        Stock stock = createStock(30, LocalDate.of(2026, 3, 25),
                LocalDate.of(2026, 4, 1), StockStatus.ARRIVED);
        stockMapper.insert(stock);

        // When: ステータスを使用済みに更新する
        stock.setStockStatus(StockStatus.USED);
        stockMapper.update(stock);

        // Then: 更新が反映される
        Stock found = stockMapper.findById(stock.getStockId());
        assertThat(found.getStockStatus()).isEqualTo(StockStatus.USED);
    }

    @Test
    void update_ステータスを廃棄に変更できる() {
        // Given: 入荷済みの在庫が登録されている
        Stock stock = createStock(20, LocalDate.of(2026, 3, 20),
                LocalDate.of(2026, 3, 27), StockStatus.ARRIVED);
        stockMapper.insert(stock);

        // When: ステータスを廃棄に更新する（品質維持日数超過）
        stock.setStockStatus(StockStatus.DISPOSED);
        stockMapper.update(stock);

        // Then: 更新が反映される
        Stock found = stockMapper.findById(stock.getStockId());
        assertThat(found.getStockStatus()).isEqualTo(StockStatus.DISPOSED);
    }

    @Test
    void deleteById_既存データの場合_削除できる() {
        // Given: 在庫が登録されている
        Stock stock = createStock(10, LocalDate.of(2026, 4, 1),
                LocalDate.of(2026, 4, 8), StockStatus.ARRIVED);
        stockMapper.insert(stock);
        Long stockId = stock.getStockId();

        // When: 削除する
        stockMapper.deleteById(stockId);

        // Then: 取得できなくなる
        Stock found = stockMapper.findById(stockId);
        assertThat(found).isNull();
    }

    private Stock createStock(int quantity, LocalDate arrivalDate, LocalDate expiryDate, StockStatus status) {
        Stock stock = new Stock();
        stock.setItemId(itemId);
        stock.setQuantity(quantity);
        stock.setArrivalDate(arrivalDate);
        stock.setExpiryDate(expiryDate);
        stock.setStockStatus(status);
        return stock;
    }
}
