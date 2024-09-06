/* eslint-disable max-len */
export default `<SOAP:Envelope xmlns:crs="http://national.carerecords.nhs.uk/schema/crs/" xmlns:SOAP="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns="urn:hl7-org:v3" xmlns:hl7="urn:hl7-org:v3">
<SOAP:Header>
    <wsa:MessageID>uuid:1234567890123456</wsa:MessageID>
    <wsa:Action>urn:nhs:names:services:mmquery/PRESCRIPTIONSEARCHRESPONSE_SM01</wsa:Action>
    <wsa:To/>
    <wsa:From>
        <wsa:Address>https://mmquery.national.ncrs.nhs.uk/syncservice</wsa:Address>
    </wsa:From>
    <communicationFunctionRcv typeCode="RCV">
        <device classCode="DEV" determinerCode="INSTANCE">
            <id root="1.2.826.0.1285.0.2.0.107" extension="1111222233334444"/>
        </device>
    </communicationFunctionRcv>
    <communicationFunctionSnd typeCode="SND">
        <device classCode="DEV" determinerCode="INSTANCE">
            <id root="1.2.826.0.1285.0.2.0.107" extension="1111222233334444"/>
        </device>
    </communicationFunctionSnd>
    <wsa:RelatesTo>uuid:9C564D38-D4C9-11E2-9720-0800271DF5D7</wsa:RelatesTo>
</SOAP:Header>
<SOAP:Body>
    <prescriptionSearchResponse>
        <PRESCRIPTIONSEARCHRESPONSE_SM01>
            <id root="1234567890123456"/>
            <creationTime value="20130614090835"/>
            <versionCode code="V3NPfIT3.0"/>
            <interactionId root="2.16.840.1.113883.2.1.3.2.4.12" extension="PRESCRIPTIONSEARCHRESPONSE_SM01"/>
            <processingCode code="P"/>
            <processingModeCode code="T"/>
            <acceptAckCode code="NE"/>
            <acknowledgement typeCode="AA">
                <messageRef>
                    <id name="9C564D38-D4C9-11E2-9720-0800271DF5D7"/>
                </messageRef>
            </acknowledgement>
            <communicationFunctionRcv typeCode="RCV">
                <device classCode="DEV" determinerCode="INSTANCE">
                    <id root="1.2.826.0.1285.0.2.0.107" extension="230811201324"/>
                </device>
            </communicationFunctionRcv>
            <communicationFunctionSnd typeCode="SND">
                <device classCode="DEV" determinerCode="INSTANCE">
                    <id root="1.2.826.0.1285.0.2.0.107" extension="Not Known"/>
                </device>
            </communicationFunctionSnd>
            <ControlActEvent classCode="CACT" moodCode="EVN">
                <author1 typeCode="AUT">
                    <AgentSystemSDS classCode="AGNT">
                        <agentSystemSDS classCode="DEV" determinerCode="INSTANCE">
                            <id root="1.2.826.0.1285.0.2.0.107" extension="Not Known"/>
                        </agentSystemSDS>
                    </AgentSystemSDS>
                </author1>
                <reason typeCode="RSON"/>
                <subject typeCode="SUBJ">
                    <searchResults xmlns="">
                        <prescription>
                            <id value="9BB9EA-Z1AD4C-11E298"/>
                            <messageId value="9BBB1304-D4C9-11E2-9720-0800271DF5D7"/>
                            <patientId value="9990406707"/>
                            <prescriberOrg code="Z99901"/>
                            <nominatedOrg value="TESCO"/>
                            <dispenserOrg value="BOOTS"/>
                            <instanceNumbers>
                                <instanceNumber value="1"/>
                                <instanceNumber value="2"/>
                            </instanceNumbers>
                            <prescriptionStatuses>
                                <prescriptionStatus value="0001"/>
                                <prescriptionStatus value="0002"/>
                            </prescriptionStatuses>
                            <prescribedDate value="20130614090834"/>
                            <completedDate value="20130714090834"/>
                        </prescription>
                        <prescription>
                            <id value="9C2560-Z38D4C-11E29F"/>
                            <messageId value="9C26BE7E-D4C9-11E2-9720-0800271DF5D7"/>
                            <patientId value="9990406707"/>
                            <prescriberOrg code="Z99901"/>
                            <nominatedOrg value=""/>
                            <dispenserOrg value=""/>
                            <instanceNumbers>
                                <instanceNumber value="1"/>
                            </instanceNumbers>
                            <prescriptionStatuses>
                                <prescriptionStatus value="0001"/>
                            </prescriptionStatuses>
                            <prescribedDate value="20130614090834"/>
                            <completedDate value=""/>
                        </prescription>
                        <prescription>
                            <id value="9B7C8C-Z38D4C-11E29N"/>
                            <messageId value="9B7E63AA-D4C9-11E2-9720-0800271DF5D7"/>
                            <patientId value="9990406707"/>
                            <prescriberOrg code="Z99901"/>
                            <nominatedOrg value=""/>
                            <dispenserOrg value=""/>
                            <instanceNumbers>
                                <instanceNumber value="1"/>
                            </instanceNumbers>
                            <prescriptionStatuses>
                                <prescriptionStatus value="0001"/>
                            </prescriptionStatuses>
                            <prescribedDate value="20130614090833"/>
                            <completedDate value=""/>
                        </prescription>
                        <prescription>
                            <id value="9BE98824-D4C9-11E2-9720-0800271DF5D7W"/>
                            <messageId value="9BEAA8BC-D4C9-11E2-9720-0800271DF5D7"/>
                            <patientId value="9990406707"/>
                            <prescriberOrg code="Z99901"/>
                            <nominatedOrg value=""/>
                            <dispenserOrg value=""/>
                            <instanceNumbers>
                                <instanceNumber value="1"/>
                            </instanceNumbers>
                            <prescriptionStatuses>
                                <prescriptionStatus value="0001"/>
                            </prescriptionStatuses>
                            <prescribedDate value="20130614090834"/>
                            <completedDate value=""/>
                        </prescription>
                    </searchResults>
                </subject>
                <queryAck type="QueryAck">
                    <queryResponseCode code="OK"/>
                </queryAck>
            </ControlActEvent>
        </PRESCRIPTIONSEARCHRESPONSE_SM01>
    </prescriptionSearchResponse>
</SOAP:Body>
</SOAP:Envelope>`
