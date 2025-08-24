import { faq } from "../models/faq";
import { User } from "../models/user";

export class MockDB {

    private static instance: MockDB;

    // Private constructor prevents direct instantiation
    private constructor() { }

    // Static method to get the single instance
    public static getInstance(): MockDB {
        if (!MockDB.instance) {
            MockDB.instance = new MockDB();
        }
        return MockDB.instance;
    }

    public readonly usersTable: User[] = [
        { "email": "lucy@mail.com", "password": "testtest", "firstname": "Lucy", "lastname": "Schopper", "street": "Inselstraße", "house_no": "1", "postcode": "78465", "city": "Konstanz", "role": "visitor" },
        { "email": "testuser@mail.com", "password": "testtest", "firstname": "Mai", "lastname": "Naubsucher", "street": "Inselstraße", "house_no": "1", "postcode": "78465", "city": "Konstanz", "role": "visitor" },
        { "email": "admin@mainau.de", "password": "testtest", "firstname": "Hans", "lastname": "Müller", "street": "Inselstraße", "house_no": "1", "postcode": "78465", "city": "Konstanz", "role": "root" },
        { "email": "elias.admin@mainau.de", "password": "testtest", "firstname": "Elias", "lastname": "Maier", "street": "Inselstraße", "house_no": "1", "postcode": "78465", "city": "Konstanz", "role": "admin" },
        { "email": "nicolas.admin@mainau.de", "password": "testtest", "firstname": "Nicolas", "lastname": "Luckert", "street": "Inselstraße", "house_no": "1", "postcode": "78465", "city": "Konstanz", "role": "admin" },
        { "email": "jonathan.admin@mainau.de", "password": "testtest", "firstname": "Jonathan", "lastname": "Häßler", "street": "Inselstraße", "house_no": "1", "postcode": "78465", "city": "Konstanz", "role": "admin" },
        { "email": "cedric.admin@mainau.de", "password": "testtest", "firstname": "Cedric", "lastname": "Wiese", "street": "Inselstraße", "house_no": "1", "postcode": "78465", "city": "Konstanz", "role": "admin" },
        { "email": "gaertner@mainau.de", "password": "testtest", "firstname": "Fritz", "lastname": "Kruse", "street": "Inselstraße", "house_no": "1", "postcode": "78465", "city": "Konstanz", "role": "gardener" },
        { "email": "paulina.gaertner@mainau.de", "password": "testtest", "firstname": "Paulina", "lastname": "Leutloff", "street": "Inselstraße", "house_no": "1", "postcode": "78465", "city": "Konstanz", "role": "gardener" },
        { "email": "robin.gaertner@mainau.de", "password": "testtest", "firstname": "Robin", "lastname": "Erb", "street": "Inselstraße", "house_no": "1", "postcode": "78465", "city": "Konstanz", "role": "gardener" }
    ];

    public readonly faqs: faq[] = [
        { "id": 0, "question": "Was ist bei der Pflege von Rosenstöcken zu beachten?", "answer": "Am wichtigsten bei Rosen ist der richtige Standort. Da Rosen die Sonne lieben, ist ein Plätzchen auf der Südseite des Hauses genau das Richtige. Auch ein wichtiger Punkt ist die Bodenbeschaffenheit: Am besten eignen sich humus-, lehm-, und sandhaltige Böden, da diese das Wasser gut halten und trotzdem locker sind. Bei einem zu schweren Boden kann es passieren, dass das Wasser nicht richtig abfließt. Rosen reagieren dann meist sehr empfindlich auf Staunässe. Ein zu lockerer Boden kann das Wasser jedoch nicht genug halten. Deshalb ist eine gute Mischung von Vorteil. Die zusätzliche Einarbeitung von Kompost in der oberen Schicht des Bodens sorgt für viele Nährstoffe. Ab dem zweiten Standjahr sollte man im März/April und nach der ersten Blüte im Juni/Juli eine Gabe organischen oder mineralischen Düngers in die obere Bodenschicht einarbeiten." },
        { "id": 1, "question": "Wie kann ich effektiv Unkraut bekämpfen?", "answer": "Es gibt sehr viele wirksame Methoden Unkraut richtig zu bekämpfen. Jedoch kursieren im Netz auch viele falsche Informationen. Damit du effektiv gegen Unkraut in deinem Garten vorgehen kannst, würden wir dich gerne persönlich dazu beraten. Dazu empfehlen wir eine Konversation über das grüne Telefon." },
        { "id": 2, "question": "Wie kann ich meine Obstbäume vor Schädlingen schützen?", "answer": "Indem Sie einen Leimring um den Stamm Ihrer Obstbäume befestigen, verhindern Sie den Befall Ihrer Bäume durch Frostspanner und andere Schädlinge. Zusätzlich sollten Sie als Schutz vor dem Eindringen der Schädlinge in Risse in der Rinde noch den Stamm Ihrer Bäume mit Kalk einschmieren. Positiver Nebeneffekt: Auch die Moosbildung am Stamm wird verhindert, da der Kalk das Sonnenlicht reflektiert." },
        { "id": 3, "question": "Wie pflege ich meinen Rasen richtig?", "answer": "Für kräftigen Rasen regelmäßig düngen: Etwa 30 Gramm auf einen Quadratmeter Rasenfläche reichen aus. Das zweite Mal wird etwa Ende Juni, das letzte Mal im August gedüngt. So ist der Rasen das ganze Jahr über optimal versorgt. Im Herbst kann ein kaliumbetonter Dünger ausgebracht werden." }
    ];

    public readonly conversations = [
        { "id": 1, "type": "Rosen", "topic": "Rosen pflanzen", "user_email": "testuser@mail.com", "gardener_email": null, "user_read": true, "gardener_read": false },
        { "id": 2, "type": "Bäume", "topic": "Apfelbaum blüht nicht", "user_email": "testuser@mail.com", "gardener_email": null, "user_read": true, "gardener_read": false },
        { "id": 3, "type": "Zimmerpflanzen", "topic": "Pflegeleichte Zimmerpflanze", "user_email": "testuser@mail.com", "gardener_email": "gaertner@mainau.de", "user_read": false, "gardener_read": true },
        { "id": 4, "type": "Schädlingsbekämpfung", "topic": "Schnecken loswerden", "user_email": "testuser@mail.com", "gardener_email": null, "user_read": true, "gardener_read": false },
        { "id": 5, "type": "Orchideen", "topic": "Orchidee Lichtbedarf", "user_email": "testuser@mail.com", "gardener_email": null, "user_read": true, "gardener_read": false },
        { "id": 6, "type": "Sonstiges", "topic": "Gartenwerkzeug", "user_email": "testuser@mail.com", "gardener_email": null, "user_read": true, "gardener_read": false }
    ];

    public readonly messages = [
        { "conversation": 1, "email": "testuser@mail.com", "msg": "Wie pflanze ich Rosen?", "created_at": "2023-07-25 12:02:06", "updated_at": "2023-07-25 12:02:06" },
        { "conversation": 2, "email": "testuser@mail.com", "msg": "Was kann ich tun, wenn mein Apfelbaum keine Blüten bildet?", "created_at": "2023-07-20 14:34:51", "updated_at": "2023-07-20 14:34:51" },
        { "conversation": 3, "email": "testuser@mail.com", "msg": "Was ist eine gute Zimmerpflanze, wenn ich keinen grünen Daumen habe?", "created_at": "2023-07-26 10:17:01", "updated_at": "2023-07-26 10:17:01" },
        { "conversation": 3, "email": "gaertner@mainau.de", "msg": "Bogenhanf muss praktisch nicht geplegt werden und überlebt Monate ohne Wasser. Daher eignet er sich sehr gut.", "created_at": "2023-07-26 11:28:56", "updated_at": "2023-07-26 11:28:56" },
        { "conversation": 3, "email": "testuser@mail.com", "msg": "Vielen Dank! Der sieht auch echt schön aus.", "created_at": "2023-07-26 14:45:21", "updated_at": "2023-07-26 14:45:21" },
        { "conversation": 3, "email": "gaertner@mainau.de", "msg": "Ja! Viel Erfolg damit und lassen Sie es mich wissen, wenn Sie weitere Tipps dazu benötigen.", "created_at": "2023-07-26 16:09:38", "updated_at": "2023-07-26 16:09:38" },
        { "conversation": 4, "email": "testuser@mail.com", "msg": "Was hilft gegen meine Schneckenplage? Am liebsten keine chemischen Mittel.", "created_at": "2023-07-21 12:02:06", "updated_at": "2023-07-21 12:02:06" },
        { "conversation": 5, "email": "testuser@mail.com", "msg": "Wie viel Licht braucht meine Orchidee?", "created_at": "2023-07-13 06:02:06", "updated_at": "2023-07-13 06:02:06" },
        { "conversation": 6, "email": "testuser@mail.com", "msg": "Welches Werkzeug brauche ich unbedingt in meinem Garten?", "created_at": "2023-07-24 21:21:21", "updated_at": "2023-07-24 21:21:21" }
    ]


    public readonly ticketcategories = [
        { "event_id": 1, "category": "Erwachsener", "price": 6.00 },
        { "event_id": 1, "category": "Kinder (bis 12)", "price": 3.00 },
        { "event_id": 1, "category": "Senioren (ab 61)", "price": 4.00 },
        { "event_id": 1, "category": "Abendticket", "price": 4.50 },
        { "event_id": 2, "category": "1-Tagesticket", "price": 5.00 },
        { "event_id": 2, "category": "3-Tagesticket", "price": 7.00 },
        { "event_id": 2, "category": "Wochenticket", "price": 10.00 },
        { "event_id": 2, "category": "Abendticket", "price": 3.50 },
        { "event_id": 3, "category": "Regulär (ab 13)", "price": 5.00 },
        { "event_id": 3, "category": "Kind (bis 12)", "price": 2.00 },
        { "event_id": 3, "category": "Senioren (ab 61)", "price": 4.00 },
        { "event_id": 4, "category": "Regulär (ab 13)", "price": 5.00 },
        { "event_id": 4, "category": "Kind (bis 12)", "price": 2.00 },
        { "event_id": 4, "category": "Senioren (ab 61)", "price": 4.00 },
        { "event_id": 5, "category": "Reguläres Ticket", "price": 50.00 },
        { "event_id": 5, "category": "Ermäßigt (Student/Schüler, Senior)", "price": 35.00 },
        { "event_id": 5, "category": "VIP-Ticket", "price": 60.00 },
        { "event_id": 6, "category": "Reguläres Ticket", "price": 49.99 },
        { "event_id": 6, "category": "Ermäßigt (Student/Schüler, Senior)", "price": 39.99 },
        { "event_id": 6, "category": "VIP-Ticket", "price": 69.99 },
        { "event_id": 7, "category": "Regulär (ab 13)", "price": 49.99 },
        { "event_id": 7, "category": "Ermäßigt (Student/Schüler, Senior)", "price": 39.99 },
        { "event_id": 7, "category": "VIP-Ticket", "price": 69.99 },
        { "event_id": 8, "category": "Erwachsener", "price": 5.00 },
        { "event_id": 8, "category": "Kleinkind (0-3)", "price": 1.00 },
        { "event_id": 8, "category": "Kind (4-12)", "price": 3.00 },
        { "event_id": 8, "category": "Familienticket (2 Erwachsene, 2 Kinder)", "price": 7.00 },
        { "event_id": 9, "category": "Reguläres Ticket", "price": 104.98 },
        { "event_id": 9, "category": "Ermäßigt (Student/Schüler, Senior)", "price": 85.00 },
        { "event_id": 9, "category": "VIP-Ticket", "price": 123.00 },
        { "event_id": 10, "category": "Reguläres Ticket", "price": 150.00 },
        { "event_id": 10, "category": "Ermäßigt (Student/Schüler, Senior)", "price": 90.00 },
        { "event_id": 10, "category": "VIP-Ticket", "price": 179.00 },
        { "event_id": 11, "category": "Reguläres Ticket", "price": 80.00 },
        { "event_id": 11, "category": "Ermäßigt (Student/Schüler, Senior)", "price": 59.00 },
        { "event_id": 11, "category": "VIP-Ticket", "price": 89.00 },
        { "event_id": 12, "category": "Regulär (ab 13)", "price": 5.00 },
        { "event_id": 12, "category": "Kleinkind (0-3)", "price": 0.00 },
        { "event_id": 12, "category": "Kind (4-12)", "price": 2.00 },
        { "event_id": 13, "category": "Regulär (ab 13)", "price": 12.00 },
        { "event_id": 13, "category": "Kinder (bis 12)", "price": 5.00 },
        { "event_id": 13, "category": "Senioren (ab 61)", "price": 7.50 },
        { "event_id": 13, "category": "Rollstuhlfahrer", "price": 6.00 },
        { "event_id": 14, "category": "Regulär (ab 13)", "price": 12.00 },
        { "event_id": 14, "category": "Kinder (bis 12)", "price": 5.00 },
        { "event_id": 14, "category": "Senioren (ab 61)", "price": 7.50 },
        { "event_id": 14, "category": "Rollstuhlfahrer", "price": 6.00 },
        { "event_id": 15, "category": "Regulär (ab 13)", "price": 12.00 },
        { "event_id": 15, "category": "Kinder (bis 12)", "price": 5.00 },
        { "event_id": 15, "category": "Senioren (ab 61)", "price": 7.50 },
        { "event_id": 15, "category": "Rollstuhlfahrer", "price": 6.00 },
        { "event_id": 16, "category": "Regulär (ab 13)", "price": 12.00 },
        { "event_id": 16, "category": "Kinder (bis 12)", "price": 5.00 },
        { "event_id": 16, "category": "Senioren (ab 61)", "price": 7.50 },
        { "event_id": 16, "category": "Rollstuhlfahrer", "price": 6.00 },
        { "event_id": 17, "category": "Regulär (ab 13)", "price": 12.00 },
        { "event_id": 17, "category": "Kleinkind (0-3)", "price": 0.00 },
        { "event_id": 17, "category": "Kind (ab 12)", "price": 5.00 },
        { "event_id": 17, "category": "Student/Schüler", "price": 7.00 },
        { "event_id": 17, "category": "Senioren (ab 61)", "price": 9.00 },
        { "event_id": 18, "category": "Regulär (ab 13)", "price": 5.00 },
        { "event_id": 18, "category": "Kind (4-12)", "price": 2.00 },
        { "event_id": 18, "category": "Familienticket (2 Erwachsene, 2 Kinder)", "price": 12.00 },
        { "event_id": 18, "category": "2-Tagesticket", "price": 8.00 },
        { "event_id": 18, "category": "3-Tagesticket", "price": 11.00 },
        { "event_id": 19, "category": "Erwachsener", "price": 5.00 },
        { "event_id": 19, "category": "Kleinkind (0-3)", "price": 1.00 },
        { "event_id": 19, "category": "Kind (4-12)", "price": 3.00 },
        { "event_id": 19, "category": "Familienticket (2 Erwachsene, 2 Kinder)", "price": 11.50 },
        { "event_id": 20, "category": "Regulär (ab 13)", "price": 5.00 },
        { "event_id": 20, "category": "Kind (4-12)", "price": 3.00 },
        { "event_id": 20, "category": "Familienticket (2 Erwachsene, 2 Kinder)", "price": 12.00 },
        { "event_id": 20, "category": "2-Tagesticket", "price": 8.00 },
        { "event_id": 20, "category": "3-Tagesticket", "price": 13.00 },
        { "event_id": 21, "category": "Reguläres Ticket", "price": 5.00 },
        { "event_id": 21, "category": "Ermäßigt (Student/Schüler)", "price": 4.00 },
        { "event_id": 21, "category": "Kinder (bis 12)", "price": 2.00 },
        { "event_id": 21, "category": "Senioren (ab 61)", "price": 4.50 },
        { "event_id": 22, "category": "Reguläres Ticket", "price": 6.00 },
        { "event_id": 22, "category": "Ermäßigt (Student/Schüler)", "price": 4.00 },
        { "event_id": 22, "category": "Kinder (bis 12)", "price": 2.00 },
        { "event_id": 22, "category": "Senioren (ab 61)", "price": 4.50 },
        { "event_id": 23, "category": "Reguläres Ticket", "price": 6.00 },
        { "event_id": 23, "category": "Ermäßigt (Student/Schüler)", "price": 4.00 },
        { "event_id": 23, "category": "Kinder (bis 12)", "price": 2.00 },
        { "event_id": 23, "category": "Senioren (ab 61)", "price": 4.50 },
        { "event_id": 24, "category": "Reguläres Ticket", "price": 6.00 },
        { "event_id": 24, "category": "Ermäßigt (Student/Schüler)", "price": 4.00 },
        { "event_id": 24, "category": "Kinder (bis 12)", "price": 2.00 },
        { "event_id": 24, "category": "Senioren (ab 61)", "price": 4.50 },
        { "event_id": 25, "category": "Reguläres Ticket", "price": 6.00 },
        { "event_id": 25, "category": "Ermäßigt (Student/Schüler)", "price": 4.00 },
        { "event_id": 25, "category": "Kinder (bis 12)", "price": 2.00 },
        { "event_id": 25, "category": "Senioren (ab 61)", "price": 4.50 },
        { "event_id": 26, "category": "Reguläres Ticket", "price": 6.00 },
        { "event_id": 26, "category": "Ermäßigt (Student/Schüler)", "price": 4.00 },
        { "event_id": 26, "category": "Kinder (bis 12)", "price": 2.00 },
        { "event_id": 26, "category": "Senioren (ab 61)", "price": 4.50 },
        { "event_id": 27, "category": "Regulär (ab 13)", "price": 6.00 },
        { "event_id": 27, "category": "Kleinkind (0-3)", "price": 2.50 },
        { "event_id": 27, "category": "Kind (4-12)", "price": 4.00 },
        { "event_id": 27, "category": "Familienticket (2 Erwachsene, 2 Kinder)", "price": 13.00 },
        { "event_id": 28, "category": "Regulär (ab 13)", "price": 6.00 },
        { "event_id": 28, "category": "Kleinkind (0-3)", "price": 2.50 },
        { "event_id": 28, "category": "Kind (4-12)", "price": 4.00 },
        { "event_id": 28, "category": "Familienticket (2 Erwachsene, 2 Kinder)", "price": 13.00 },
        { "event_id": 29, "category": "Regulär (ab 13)", "price": 6.00 },
        { "event_id": 29, "category": "Kleinkind (0-3)", "price": 2.50 },
        { "event_id": 29, "category": "Kind (4-12)", "price": 4.00 },
        { "event_id": 29, "category": "Familienticket (2 Erwachsene, 2 Kinder)", "price": 13.00 },
        { "event_id": 30, "category": "Regulär (ab 13)", "price": 6.00 },
        { "event_id": 30, "category": "Kleinkind (0-3)", "price": 2.50 },
        { "event_id": 30, "category": "Kind (4-12)", "price": 4.00 },
        { "event_id": 30, "category": "Familienticket (2 Erwachsene, 2 Kinder)", "price": 13.00 },
        { "event_id": 31, "category": "Regulär (ab 13)", "price": 6.00 },
        { "event_id": 31, "category": "Kleinkind (0-3)", "price": 2.50 },
        { "event_id": 31, "category": "Kind (4-12)", "price": 4.00 },
        { "event_id": 31, "category": "Familienticket (2 Erwachsene, 2 Kinder)", "price": 13.00 },
        { "event_id": 32, "category": "Regulär (ab 13)", "price": 6.00 },
        { "event_id": 32, "category": "Kleinkind (0-3)", "price": 2.50 },
        { "event_id": 32, "category": "Kind (4-12)", "price": 4.00 },
        { "event_id": 32, "category": "Familienticket (2 Erwachsene, 2 Kinder)", "price": 13.00 },
        { "event_id": 33, "category": "Regulär (ab 13)", "price": 6.00 },
        { "event_id": 33, "category": "Kleinkind (0-3)", "price": 2.50 },
        { "event_id": 33, "category": "Kind (4-12)", "price": 4.00 },
        { "event_id": 33, "category": "Familienticket (2 Erwachsene, 2 Kinder)", "price": 13.00 },
        { "event_id": 34, "category": "Regulär (ab 13)", "price": 6.00 },
        { "event_id": 34, "category": "Kleinkind (0-3)", "price": 2.50 },
        { "event_id": 34, "category": "Kind (4-12)", "price": 4.00 },
        { "event_id": 34, "category": "Familienticket (2 Erwachsene, 2 Kinder)", "price": 13.00 },
        { "event_id": 35, "category": "Regulär (ab 13)", "price": 6.00 },
        { "event_id": 35, "category": "Kleinkind (0-3)", "price": 2.50 },
        { "event_id": 35, "category": "Kind (4-12)", "price": 4.00 },
        { "event_id": 35, "category": "Familienticket (2 Erwachsene, 2 Kinder)", "price": 13.00 },
        { "event_id": 36, "category": "Erwachsener", "price": 12.50 },
        { "event_id": 36, "category": "Ermäßigt (Student/Schüler, Senior)", "price": 9.50 },
        { "event_id": 36, "category": "Kinder (bis 12)", "price": 5.50 }]


    public readonly tickets = [
        { "email": "testuser@mail.com", "event_id": 1, "category": "Erwachsener", "amount": 2 },
        { "email": "testuser@mail.com", "event_id": 1, "category": "Kinder (bis 12)", "amount": 3 },
        { "email": "testuser@mail.com", "event_id": 4, "category": "Regulär (ab 13)", "amount": 1 },
        { "email": "testuser@mail.com", "event_id": 4, "category": "Kinder (bis 12)", "amount": 2 },
    ]


}




