import React, { useState, useEffect, state } from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font
} from "@react-pdf/renderer";
import { useTranslation } from 'react-i18next';

function EmployeePDF(props) {
    const { t } = useTranslation('common');

    Font.register({
        family: 'Rajdhani', fonts: [
            { src: "/font/Rajdhani.ttf" },
            { src: "/font/Rajdhani-Bold.ttf", fontWeight: "bold" },
        ]
    });
    const styles = StyleSheet.create({
        font: {
            fontFamily: 'Rajdhani'
        },
        page: {
            backgroundColor: "#ffffff",
            margin: 20,
        },
        fontBold: {
            fontFamily: 'Rajdhani',
            fontWeight: "bold"
        },
        row: {
            flexDirection: "row",
            display: "flex"

        },
        marginRight: {
            marginRight: 5
        },
        marginLeft: {
            marginLeft: 5
        },
        section: {
            marginTop: 10
        },
        title: {
            fontSize: 20
        },
        projectSection: {
            backgroundColor: "#e0e0e0;",
            margin: 10,
            padding: 5,
            width: 530

        }


    })

        
    return (

            <Document  >

                <Page style={[styles.font, styles.page]}>
                    <View style={styles.section}>
                        <View style={styles.row} >
                            <Text style={[styles.title, styles.fontBold]}>
                                {t('pdf.employeeDetails')}
                            </Text>
                        </View>
                        <View style={styles.row} >
                            <Text style={styles.marginRight}>
                                {`${t('common.phoneNumber')}: `}
                            </Text>
                            <Text style={styles.fontBold}>
                                {`${props.data.phoneNumber}`}
                            </Text>

                        </View>
                        <View style={styles.row}>
                            <Text style={styles.marginRight}>
                                {`${t('common.emailAdress')}: `}
                            </Text>
                            <Text style={styles.fontBold}>
                                {`${props.data.email}`}
                            </Text>
                        </View>
                        <View style={styles.row} >
                            <Text >
                                {`${t('pdf.employee')}: `}
                            </Text>
                            <Text style={styles.fontBold}>
                                {`${props.data.firstName} ${props.data.lastName}`}
                            </Text>
                        </View>
                        <View style={styles.row} >
                            <Text style={styles.marginRight}>
                                {`${t('project.totalHoursShort')}: `}
                            </Text>
                            <Text style={styles.fontBold}>
                                {props.data.totalActiveHours}
                            </Text>
                            <Text style={[styles.marginRight, styles.marginLeft]}>
                                {`${t('employee.totalActiveProjects')}: `}
                            </Text>
                            <Text style={styles.fontBold}>
                                {props.data.projects ? (props.data.projects.filter((y) => {
                                    return y.removed != true
                                })).length : 0}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View >
                            <Text style={[styles.title, styles.fontBold]}>
                                {`${t('employee.activeProjects')}:`}
                            </Text>
                            {props.data.projects ? props.data.projects.map((x, index) => {
                                x.removed == false
                                return (
                                    <View key={x.id} style={styles.projectSection}>
                                        <View style={styles.row}>
                                            <Text>{`${t('pdf.projectName')}:`} </Text>
                                            <Text style={[styles.fontBold, styles.marginLeft]}>{x.name} </Text>
                                        </View>
                                        <View style={styles.row}>
                                            <Text>{`${t('common.quantityHours')}:`} </Text>
                                            <Text style={[styles.fontBold, styles.marginLeft]}>{`${x.hours}`} </Text>
                                        </View>

                                    </View>
                                )

                            }) : <Text>{`${t('project.noProject')}`} </Text>
                            }
                        </View>
                    </View>
                </Page>
            </Document>
    );
}

export default EmployeePDF;