package com.bookcrossing.springboot.util;

import org.marc4j.MarcStreamReader;
import org.marc4j.MarcReader;
import org.marc4j.marc.Record;
import org.marc4j.marc.DataField;
import org.marc4j.marc.Subfield;
import org.marc4j.marc.VariableField;
import org.marc4j.marc.Leader;
import org.marc4j.marc.ControlField;

import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.List;

public class MarcToDatabase {

    public static void main(String[] args) {
        String filePath = "C:\\Users\\mateu\\Desktop\\BookCrossing\\BookCrossing\\src\\main\\java\\com\\bookcrossing\\springboot\\util\\bibs-ksiazka.mrc";
        String jdbcUrl = "jdbc:postgresql://localhost:5432/book_crossing";
        String username = "postgres";
        String password = "admin";

        try (FileInputStream fis = new FileInputStream(filePath);
             Connection conn = DriverManager.getConnection(jdbcUrl, username, password)) {

            conn.setAutoCommit(false);
            MarcReader reader = new MarcStreamReader(fis);
            String sql = "INSERT INTO marc_records (title, author, publisher, publication_year, isbn, genre_form, physical_description, subject_headings, personal_names, corporate_names, series_statements, alternative_format_availability, holdings_and_access, general_notes, holdings_notes, summary, table_of_contents, language_code, summary_language, original_language, language_note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                int batchSize = 1000;
                int count = 0;

                while (reader.hasNext()) {
                    Record record = reader.next();
                    String title = getSubfield(record, "245", 'a');
                    String author = getSubfield(record, "100", 'a');
                    String publisher = getSubfield(record, "260", 'b');
                    String publicationYear = getSubfield(record, "260", 'c');
                    String isbn = getSubfield(record, "020", 'a');
                    String genreForm = getSubfield(record, "655", 'a');
                    String physicalDescription = getSubfield(record, "300", 'a');
                    String subjectHeadings = getSubfield(record, "650", 'a');
                    String personalNames = getSubfield(record, "700", 'a');
                    String corporateNames = getSubfield(record, "710", 'a');
                    String seriesStatements = getSubfield(record, "490", 'a');
                    String alternativeFormatAvailability = getSubfield(record, "856", 'u');
                    String holdingsAndAccess = getSubfield(record, "852", 'a');
                    String generalNotes = getSubfield(record, "500", 'a');
                    String holdingsNotes = getSubfield(record, "561", 'a');
                    String summary = getSubfield(record, "520", 'a');
                    String tableOfContents = getSubfield(record, "505", 'a');
                    String languageCode = getFixedField(record, "008", 35, 37);
                    String summaryLanguage = getSubfield(record, "041", 'b');
                    String originalLanguage = getSubfield(record, "041", 'h');
                    String languageNote = getSubfield(record, "546", 'a');

                    pstmt.setString(1, title);
                    pstmt.setString(2, author);
                    pstmt.setString(3, publisher);
                    pstmt.setString(4, publicationYear);
                    pstmt.setString(5, isbn);
                    pstmt.setString(6, genreForm);
                    pstmt.setString(7, physicalDescription);
                    pstmt.setString(8, subjectHeadings);
                    pstmt.setString(9, personalNames);
                    pstmt.setString(10, corporateNames);
                    pstmt.setString(11, seriesStatements);
                    pstmt.setString(12, alternativeFormatAvailability);
                    pstmt.setString(13, holdingsAndAccess);
                    pstmt.setString(14, generalNotes);
                    pstmt.setString(15, holdingsNotes);
                    pstmt.setString(16, summary);
                    pstmt.setString(17, tableOfContents);
                    pstmt.setString(18, languageCode);
                    pstmt.setString(19, summaryLanguage);
                    pstmt.setString(20, originalLanguage);
                    pstmt.setString(21, languageNote);

                    pstmt.addBatch();

                    if (++count % batchSize == 0) {
                        pstmt.executeBatch();
                        conn.commit();
                    }
                }

                pstmt.executeBatch();
                conn.commit();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static String getSubfield(Record record, String tag, char subfieldCode) {
        List<VariableField> fields = record.getVariableFields(tag);
        if (fields != null && !fields.isEmpty()) {
            DataField field = (DataField) fields.get(0);
            Subfield subfield = field.getSubfield(subfieldCode);
            if (subfield != null) {
                return subfield.getData();
            }
        }
        return null;
    }

    private static String getFixedField(Record record, String tag, int start, int end) {
        ControlField controlField = (ControlField) record.getVariableField(tag);
        if (controlField != null) {
            String data = controlField.getData();
            if (data.length() >= end) {
                return data.substring(start, end).trim();
            }
        }
        return null;
    }
}