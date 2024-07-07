package com.bookcrossing.springboot.util;

import org.marc4j.MarcStreamReader;
import org.marc4j.MarcReader;
import org.marc4j.marc.Record;
import org.marc4j.marc.DataField;
import org.marc4j.marc.Subfield;

import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class MarcToDatabase {

    public static void insertMarcRecords(String filePath, String jdbcUrl, String username, String password) {
        try (FileInputStream fis = new FileInputStream(filePath);
             Connection conn = DriverManager.getConnection(jdbcUrl, username, password)) {

            conn.setAutoCommit(false);
            MarcReader reader = new MarcStreamReader(fis);

            String sql = "INSERT INTO marc_records (title, author, publisher, publication_year, isbn) " +
                         "VALUES (?, ?, ?, ?, ?)";

            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                while (reader.hasNext()) {
                    Record record = reader.next();
                    String title = getSubfield(record, "245", 'a');
                    String author = getSubfield(record, "100", 'a');
                    String publisher = getSubfield(record, "260", 'b');
                    String publicationYear = getSubfield(record, "260", 'c');
                    String isbn = getSubfield(record, "020", 'a');

                    pstmt.setString(1, title);
                    pstmt.setString(2, author);
                    pstmt.setString(3, publisher);
                    pstmt.setString(4, publicationYear);
                    pstmt.setString(5, isbn);
                    pstmt.addBatch();
                }
                pstmt.executeBatch();
            }
            conn.commit();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static String getSubfield(Record record, String tag, char code) {
        DataField field = (DataField) record.getVariableField(tag);
        if (field != null) {
            Subfield subfield = field.getSubfield(code);
            if (subfield != null) {
                return subfield.getData();
            }
        }
        return null;
    }
}