/* eslint-disable max-len */
export default `<?xml version='1.0' encoding='UTF-8'?>
<SOAP:Envelope xmlns:crs="http://national.carerecords.nhs.uk/schema/crs/"
    xmlns:SOAP="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns="urn:hl7-org:v3"
    xmlns:hl7="urn:hl7-org:v3">
    <SOAP:Header>
        <wsa:MessageID>uuid:C3CE4FF8-692A-11EF-81D2-000C297C24E7</wsa:MessageID>
        <wsa:Action>urn:nhs:names:services:mmquery/PORX_IN000006UK98</wsa:Action>
        <wsa:To />
        <wsa:From>
            <wsa:Address>https://mmquery.national.ncrs.nhs.uk/syncservice</wsa:Address>
        </wsa:From>
        <communicationFunctionRcv typeCode="RCV">
            <device classCode="DEV" determinerCode="INSTANCE">
                <id root="1.2.826.0.1285.0.2.0.107" extension="230811201324" />
            </device>
        </communicationFunctionRcv>
        <communicationFunctionSnd typeCode="SND">
            <device classCode="DEV" determinerCode="INSTANCE">
                <id root="1.2.826.0.1285.0.2.0.107" extension="Not Known" />
            </device>
        </communicationFunctionSnd>
        <wsa:RelatesTo>uuid:C3BDDB35-692A-11EF-81D2-000C297C24E7</wsa:RelatesTo>
    </SOAP:Header>
    <SOAP:Body>
        <prescriptionClinicalViewResponse>
            <PORX_IN000006UK98>
                <id root="C3CE4FF8-692A-11EF-81D2-000C297C24E7" />
                <creationTime value="20240902125626" />
                <versionCode code="V3NPfIT3.0" />
                <interactionId root="2.16.840.1.113883.2.1.3.2.4.12" extension="PORX_IN000006UK98" />
                <processingCode code="P" />
                <processingModeCode code="T" />
                <acceptAckCode code="NE" />
                <acknowledgement typeCode="AA">
                    <messageRef>
                        <id root="C3BDDB35-692A-11EF-81D2-000C297C24E7" />
                    </messageRef>
                </acknowledgement>
                <communicationFunctionRcv typeCode="RCV">
                    <device classCode="DEV" determinerCode="INSTANCE">
                        <id root="1.2.826.0.1285.0.2.0.107" extension="230811201324" />
                    </device>
                </communicationFunctionRcv>
                <communicationFunctionSnd typeCode="SND">
                    <device classCode="DEV" determinerCode="INSTANCE">
                        <id root="1.2.826.0.1285.0.2.0.107" extension="Not Known" />
                    </device>
                </communicationFunctionSnd>
                <ControlActEvent classCode="CACT" moodCode="EVN">
                    <author1 typeCode="AUT">
                        <AgentSystemSDS classCode="AGNT">
                            <agentSystemSDS classCode="DEV" determinerCode="INSTANCE">
                                <id root="1.2.826.0.1285.0.2.0.107" extension="Not Known" />
                            </agentSystemSDS>
                        </AgentSystemSDS>
                    </author1>
                    <reason typeCode="RSON" />
                    <subject typeCode="SUBJ">
                        <PrescriptionJsonQueryResponse
                            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                            xsi:schemaLocation="urn:hl7-org:v3 ..\\schemas\\PORX_MT000006UK02.xsd"
                            classCode="ORGANIZER" moodCode="EVN">
                            <id root="F8966CE0-E034-11DA-863F-A7A405B41481" />
                            <effectiveTime value="20050922101500" />
                            <epsIndex><!-- These are the secondary index items for the record-->
                                <prescribingSite_status>['Z99901_0002', 'Z99901_9000']</prescribingSite_status>
                                <nominatedPharmacy_status>['F001M_0002', 'F001M_9000']</nominatedPharmacy_status>
                                <nextActivity_nextActivityDate>['expire_20250902']</nextActivity_nextActivityDate>
                                <dispenser_status>['F001M_0002']</dispenser_status>
                            </epsIndex>
                            <epsRecord><!-- These are the other fields stored on the JSON for the
                                record--><!--Prescription
                                Instance Specific Information-->
                                <releaseRequestMsgRef>20140930145051741475_36CFCC_2</releaseRequestMsgRef>
                                <prescriptionStatus>0006</prescriptionStatus>
                                <nominatedDownloadDate />
                                <downloadDate />
                                <completionDate>20170930</completionDate>
                                <expiryDate>20250902</expiryDate>
                                <dispenseWindow>
                                    <low value="20170930" />
                                    <high value="20151010" />
                                </dispenseWindow>
                                <instanceNumber>1</instanceNumber>
                                <lineItem>
                                    <order value="1" />
                                    <ID value="02ED7776-21CD-4E7B-AC9D-D1DBFEE7B8CF" />
                                    <previousStatus value="0008" />
                                    <lineItemMaxRepeats value="2" />
                                    <status value="0001" />
                                </lineItem>
                                <lineItem>
                                    <order value="2" />
                                    <ID value="45D5FB11-D793-4D51-9ADD-95E0F54D2786" />
                                    <previousStatus value="0008" />
                                    <lineItemMaxRepeats value="2" />
                                    <status value="0001" />
                                </lineItem><!--Prescription
                                History-->
                                <history>
                                    <SCN>2</SCN>
                                    <instance>1</instance>
                                    <interactionID>PORX_IN020101UK31</interactionID>
                                    <status>0001</status>
                                    <instanceStatus>0001</instanceStatus>
                                    <agentPerson>None</agentPerson>
                                    <agentSystem>230811201324</agentSystem>
                                    <agentPersonOrgCode />
                                    <message>"Prescription upload successful"</message>
                                    <messageID>"D3C12341-DB35-4560-BB8C-067423D5DCA6"</messageID>
                                    <timestamp>"20170930141000"</timestamp>
                                    <toASID>"230811201324"</toASID>
                                    <fromASID>"990101234567"</fromASID>
                                </history>
                                <history>
                                    <SCN>3</SCN>
                                    <instance>1</instance>
                                    <interactionID>PORX_IN132004UK30</interactionID>
                                    <status>0002</status>
                                    <instanceStatus>0002</instanceStatus>
                                    <agentPerson>None</agentPerson>
                                    <agentSystem>230811201324</agentSystem>
                                    <agentPersonOrgCode />
                                    <message>"Release Request successful"</message>
                                    <messageID>"CA7EAEB3-8473-4372-8434-0598C6888ADF"</messageID>
                                    <timestamp>"20170930141001"</timestamp>
                                    <toASID>"230811201324"</toASID>
                                    <fromASID>"990101234567"</fromASID>
                                </history>
                                <filteredHistory>
                                    <SCN>2</SCN>
                                    <timestamp>20170930141000</timestamp>
                                    <fromStatus>False</fromStatus>
                                    <toStatus>0001</toStatus>
                                    <agentPerson>None</agentPerson>
                                    <agentRoleProfileCodeId>None</agentRoleProfileCodeId>
                                    <message>Prescription upload successful</message>
                                    <orgASID>230811201324</orgASID>
                                    <agentPersonOrgCode>None</agentPersonOrgCode>
                                    <lineStatusChangeDict>
                                        <line>
                                            <order>1</order>
                                            <id>02ED7776-21CD-4E7B-AC9D-D1DBFEE7B8CF</id>
                                            <fromStatus>None</fromStatus>
                                            <toStatus>None</toStatus>
                                        </line>
                                        <line>
                                            <order>2</order>
                                            <id>45D5FB11-D793-4D51-9ADD-95E0F54D2786</id>
                                            <status />
                                            <fromStatus>None</fromStatus>
                                            <toStatus>None</toStatus>
                                        </line>
                                    </lineStatusChangeDict>
                                </filteredHistory>
                                <filteredHistory>
                                    <SCN>3</SCN>
                                    <timestamp>20170930141001</timestamp>
                                    <fromStatus>0001</fromStatus>
                                    <toStatus>0002</toStatus>
                                    <agentPerson>None</agentPerson>
                                    <agentRoleProfileCodeId>None</agentRoleProfileCodeId>
                                    <message>Release Request successful</message>
                                    <orgASID>230811201324</orgASID>
                                    <agentPersonOrgCode>None</agentPersonOrgCode>
                                    <lineStatusChangeDict>
                                        <line>
                                            <order>1</order>
                                            <id>02ED7776-21CD-4E7B-AC9D-D1DBFEE7B8CF</id>
                                            <fromStatus>None</fromStatus>
                                            <toStatus>None</toStatus>
                                        </line>
                                        <line>
                                            <order>2</order>
                                            <id>45D5FB11-D793-4D51-9ADD-95E0F54D2786</id>
                                            <status />
                                            <fromStatus>None</fromStatus>
                                            <toStatus>None</toStatus>
                                        </line>
                                    </lineStatusChangeDict>
                                </filteredHistory><!--Dispense
                                Specific Information-->
                                <dispensingOrganization>F001M</dispensingOrganization>
                                <lastDispenseDate>20170930</lastDispenseDate>
                                <lastDispenseNotificationMsgRef>20140930145056418608_85D454_2</lastDispenseNotificationMsgRef>
                                <lastDispenseNotificationGuid>2BCBB762-48B1-11E4-B20C-08002750C8A3</lastDispenseNotificationGuid><!--Claim
                                Specific Information-->
                                <claimReceivedDate>False</claimReceivedDate><!--Prescription
                                Specific Information-->
                                <currentInstance>1</currentInstance>
                                <signedTime>20170930141000</signedTime>
                                <prescriptionTreatmentType>0003</prescriptionTreatmentType>
                                <prescriptionType>0001</prescriptionType>
                                <prescriptionTime>20170930141000</prescriptionTime>
                                <prescriptionID>773810-Z4848A-11E4B</prescriptionID>
                                <prescriptionMsgRef>20140930141000617354_ACFE5A_2</prescriptionMsgRef>
                                <prescribingOrganization>Z99901</prescribingOrganization>
                                <daysSupply>28</daysSupply>
                                <maxRepeats>2</maxRepeats>
                                <eventID>773D803C-48AB-11E4-BE55-08002750C8A3</eventID><!--Patient
                                Specific Information-->
                                <lowerAgeLimit>19960419</lowerAgeLimit>
                                <higherAgeLimit>20400420</higherAgeLimit>
                                <patientNhsNumber>9990406707</patientNhsNumber>
                                <patientBirthTime>19800420</patientBirthTime><!--Nomination
                                Specific Information-->
                                <nominatedPerformer>F001M</nominatedPerformer>
                                <nominatedPerformerType>P1</nominatedPerformerType><!--Parent
                                Prescription Information-->
                                <parentPrescription>
                                    <birthTime>19800420</birthTime>
                                    <administrativeGenderCode>1</administrativeGenderCode>
                                    <prefix>MR</prefix>
                                    <given>DONOTUSE</given>
                                    <family>XXTESTPATIENTTRCEONE</family>
                                    <suffix />
                                    <addrLine1>PRINCES EXCHANGE</addrLine1>
                                    <addrLine2>PRINCES SQUARE</addrLine2>
                                    <addrLine3>LEEDS</addrLine3>
                                    <postalCode>LS1 4HY</postalCode>
                                    <productLineItem1>Perindopril erbumine 2mg tablets</productLineItem1>
                                    <quantityLineItem1>30</quantityLineItem1>
                                    <narrativeLineItem1>tablet</narrativeLineItem1>
                                    <dosageLineItem1>As directed</dosageLineItem1>
                                    <productLineItem2>Metformin 500mg modified-release tablets</productLineItem2>
                                    <quantityLineItem2>28</quantityLineItem2>
                                    <narrativeLineItem2>tablet</narrativeLineItem2>
                                    <dosageLineItem2>As directed</dosageLineItem2>
                                    <productLineItem3 />
                                    <quantityLineItem3 />
                                    <narrativeLineItem3 />
                                    <dosageLineItem3 />
                                    <productLineItem4 />
                                    <quantityLineItem4 />
                                    <narrativeLineItem4 />
                                    <dosageLineItem4 />
                                </parentPrescription>
                            </epsRecord>
                        </PrescriptionJsonQueryResponse>
                    </subject>
                    <queryAck type="QueryAck">
                        <queryResponseCode code="OK" />
                    </queryAck>
                </ControlActEvent>
            </PORX_IN000006UK98>
        </prescriptionClinicalViewResponse>
    </SOAP:Body>
</SOAP:Envelope>`
