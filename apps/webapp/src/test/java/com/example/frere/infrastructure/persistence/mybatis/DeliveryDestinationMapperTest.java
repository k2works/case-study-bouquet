package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.customer.Customer;
import com.example.frere.domain.model.destination.DeliveryDestination;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@MybatisTest
class DeliveryDestinationMapperTest {

    @Autowired
    private DeliveryDestinationMapper deliveryDestinationMapper;

    @Autowired
    private CustomerMapper customerMapper;

    private Long customerId;

    @BeforeEach
    void setUp() {
        // FK 親テーブル: 得意先を先に登録
        Customer customer = new Customer();
        customer.setName("テスト得意先");
        customer.setEmail("dest-test@example.com");
        customer.setPasswordHash("hashed_password");
        customer.setPhone("090-0000-0000");
        customer.setAddress("東京都テスト区");
        customerMapper.insert(customer);
        customerId = customer.getCustomerId();
    }

    @Test
    void findAll_データが存在する場合_全件取得できる() {
        // Given: 届け先が登録されている
        DeliveryDestination dest = createDestination("山田花子", "080-1111-2222", "100-0001", "東京都千代田区");
        deliveryDestinationMapper.insert(dest);

        // When: 全件取得する
        List<DeliveryDestination> destinations = deliveryDestinationMapper.findAll();

        // Then: 登録した届け先が含まれる
        assertThat(destinations).isNotEmpty();
        assertThat(destinations).anyMatch(d -> "山田花子".equals(d.getName()));
    }

    @Test
    void findById_存在するIDの場合_届け先が取得できる() {
        // Given: 届け先が登録されている
        DeliveryDestination dest = createDestination("鈴木太郎", "070-3333-4444", "150-0002", "東京都渋谷区");
        deliveryDestinationMapper.insert(dest);
        Long destinationId = dest.getDestinationId();

        // When: IDで検索する
        DeliveryDestination found = deliveryDestinationMapper.findById(destinationId);

        // Then: 一致する届け先が返る
        assertThat(found).isNotNull();
        assertThat(found.getCustomerId()).isEqualTo(customerId);
        assertThat(found.getName()).isEqualTo("鈴木太郎");
        assertThat(found.getPhone()).isEqualTo("070-3333-4444");
        assertThat(found.getPostalCode()).isEqualTo("150-0002");
        assertThat(found.getAddress()).isEqualTo("東京都渋谷区");
    }

    @Test
    void findById_存在しないIDの場合_nullが返る() {
        // Given: 存在しないID
        Long nonExistentId = 99999L;

        // When: IDで検索する
        DeliveryDestination found = deliveryDestinationMapper.findById(nonExistentId);

        // Then: nullが返る
        assertThat(found).isNull();
    }

    @Test
    void insert_正常なデータの場合_登録できる() {
        // Given: 新規届け先データ
        DeliveryDestination dest = createDestination("佐藤次郎", "060-5555-6666", "530-0001", "大阪府大阪市北区");

        // When: 登録する
        deliveryDestinationMapper.insert(dest);

        // Then: IDが自動採番され、findByIdで取得できる
        assertThat(dest.getDestinationId()).isNotNull();
        DeliveryDestination found = deliveryDestinationMapper.findById(dest.getDestinationId());
        assertThat(found.getName()).isEqualTo("佐藤次郎");
        assertThat(found.getCustomerId()).isEqualTo(customerId);
    }

    @Test
    void update_既存データの場合_更新できる() {
        // Given: 届け先が登録されている
        DeliveryDestination dest = createDestination("田中三郎", "050-7777-8888", "812-0011", "福岡県福岡市博多区");
        deliveryDestinationMapper.insert(dest);

        // When: 住所と郵便番号を更新する
        dest.setAddress("福岡県福岡市中央区");
        dest.setPostalCode("810-0001");
        deliveryDestinationMapper.update(dest);

        // Then: 更新が反映される
        DeliveryDestination found = deliveryDestinationMapper.findById(dest.getDestinationId());
        assertThat(found.getAddress()).isEqualTo("福岡県福岡市中央区");
        assertThat(found.getPostalCode()).isEqualTo("810-0001");
        assertThat(found.getName()).isEqualTo("田中三郎");
    }

    @Test
    void deleteById_既存データの場合_削除できる() {
        // Given: 届け先が登録されている
        DeliveryDestination dest = createDestination("高橋四郎", "040-9999-0000", "460-0008", "名古屋市中区");
        deliveryDestinationMapper.insert(dest);
        Long destinationId = dest.getDestinationId();

        // When: 削除する
        deliveryDestinationMapper.deleteById(destinationId);

        // Then: 取得できなくなる
        DeliveryDestination found = deliveryDestinationMapper.findById(destinationId);
        assertThat(found).isNull();
    }

    private DeliveryDestination createDestination(String name, String phone, String postalCode, String address) {
        DeliveryDestination dest = new DeliveryDestination();
        dest.setCustomerId(customerId);
        dest.setName(name);
        dest.setPhone(phone);
        dest.setPostalCode(postalCode);
        dest.setAddress(address);
        return dest;
    }
}
