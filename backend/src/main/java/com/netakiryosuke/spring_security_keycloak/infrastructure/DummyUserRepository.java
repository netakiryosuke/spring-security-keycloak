package com.netakiryosuke.spring_security_keycloak.infrastructure;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.netakiryosuke.spring_security_keycloak.domain.User;
import com.netakiryosuke.spring_security_keycloak.domain.UserRepository;

@Repository
public class DummyUserRepository implements UserRepository {

    private static final String TARGET_USER_ID = "4c8dc326-a091-4e58-8311-14e6c9b78425";

    private static final List<User> STORE = List.of(
        new User("83371f03-6922-449f-9d58-dd5013089f8d", "testuser", "user@example.com",
                LocalDate.parse("1998-03-12"), "東京都", "エンジニア", "休日はカフェ巡りをしています。", "いつか自分のカフェを開きたい。"),
        new User("cbce3bf2-eedd-4205-8f94-f5a2d34a1889", "adminuser", "admin@example.com",
                LocalDate.parse("1990-11-20"), "神奈川県", "運営スタッフ", "安心して交流できる場所を目指しています。", "休日は陶芸教室に通っています。"),
        new User(TARGET_USER_ID, "osawa", "osawa@example.com",
                LocalDate.parse("2003-03-28"), "神奈川県", "エンジニア", "お酒が好きです。", "初デートの待ち合わせは月の見える喫茶店。"),
        new User("9970b36d-50ad-4f87-9ce6-7ca8185ed2c9", "sora", "sora@example.com",
                LocalDate.parse("1997-02-18"), "大阪府", "デザイナー", "美術館を一緒に巡りたいです。", "実は絵本を描いています。"),
        new User("118bcf61-3dc4-45dd-b095-694182f2f101", "aoi", "aoi@example.com",
                LocalDate.parse("1996-09-03"), "京都府", "司書", "おすすめの本を教えてください。", "好きな人に短歌を贈ってみたい。"),
        new User("228bcf61-3dc4-45dd-b095-694182f2f102", "ren", "ren@example.com",
                LocalDate.parse("1993-12-15"), "福岡県", "料理人", "新しいレシピを試すのが楽しみです。", "緊張すると料理を作りすぎます。"),
        new User("338bcf61-3dc4-45dd-b095-694182f2f103", "yui", "yui@example.com",
                LocalDate.parse("1999-04-08"), "北海道", "看護師", "旅行先で写真を撮っています。", "次の旅行は大切な人と行きたい。"),
        new User("448bcf61-3dc4-45dd-b095-694182f2f104", "kaito", "kaito@example.com",
                LocalDate.parse("1994-06-21"), "愛知県", "建築士", "街の建物を眺めるのが好きです。", "理想の家のスケッチを持っています。"),
        new User("558bcf61-3dc4-45dd-b095-694182f2f105", "mio", "mio@example.com",
                LocalDate.parse("1998-10-10"), "兵庫県", "販売員", "休日はパン屋を探しています。", "好きなパンを半分ずつ分けたい。"),
        new User("668bcf61-3dc4-45dd-b095-694182f2f106", "itsuki", "itsuki@example.com",
                LocalDate.parse("1992-01-30"), "長野県", "農家", "季節の野菜を育てています。", "花束の代わりに野菜を贈ったことがあります。"),
        new User("778bcf61-3dc4-45dd-b095-694182f2f107", "hina", "hina@example.com",
                LocalDate.parse("2000-08-16"), "宮城県", "編集者", "音楽と喫茶店が好きです。", "恋愛小説の結末でいつも泣きます。"),
        new User("888bcf61-3dc4-45dd-b095-694182f2f108", "takumi", "takumi@example.com",
                LocalDate.parse("1991-05-27"), "広島県", "整備士", "週末はサイクリングをしています。", "二人乗りの自転車に憧れています。"),
        new User("998bcf61-3dc4-45dd-b095-694182f2f109", "saki", "saki@example.com",
                LocalDate.parse("1997-11-06"), "静岡県", "保育士", "海辺を歩くのが好きです。", "手紙でもらった言葉を大切にしています。"),
        new User("aa8bcf61-3dc4-45dd-b095-694182f2f110", "nao", "nao@example.com",
                LocalDate.parse("1995-03-25"), "埼玉県", "研究員", "ボードゲーム仲間を探しています。", "気になる人にはわざと負けてしまいます。"),
        new User("bb8bcf61-3dc4-45dd-b095-694182f2f111", "koharu", "koharu@example.com",
                LocalDate.parse("1996-12-02"), "沖縄県", "ガイド", "地元の景色を紹介したいです。", "秘密の夕日スポットがあります。")
    );

    @Override
    public Optional<User> findById(String id) {
        return STORE.stream()
                .filter(user -> user.id().equals(id))
                .findFirst();
    }

    @Override
    public List<User> findAll() {
        return STORE;
    }
}
