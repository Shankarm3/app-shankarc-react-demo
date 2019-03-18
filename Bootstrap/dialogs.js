<!-- Dialogs to be loaded by JQuery UI-->
<div id="claim_decline_dialog" style="overflow: scroll; overflow-x:hidden;  max-height: 300px;">
    <div id="claim_decline_wrapper">

        <div style="margin-left: 20px;">
            <label style="font-weight: bold;">{claim_decline_dialog_decline_claim_label}</label>
            <input type="checkbox" name="region" value="1"  style="margin-left: 20px;">
            <label>{claim_decline_dialog_decide_reason_code}</label>
        </div>

    </div>
</div>

<div id="claim_approve_dialog" style="overflow: scroll; overflow-x:hidden;  max-height: 300px;">
    <div id="claim_approve_wrapper">

        <div style="margin-left: 20px;">
            <label style="font-weight: bold;">{claim_approve_dialog_approve_claim_label}</label>
            <input type="checkbox" name="region" value="1"  style="margin-left: 20px;">
            <label>{claim_decline_dialog_decide_reason_code}</label>
        </div>

    </div>
</div>
<div id="claim_forward_dialog" style="overflow: scroll; overflow-x:hidden;  max-height: 300px;">
    <div id="claim_forward_wrapper">

        <div style="margin-left: 20px;">
            <label style="font-weight: bold;">Forward Claim(s):</label>
        </div>

    </div>
</div>
<div id="show_name_dialog" style="overflow: scroll;overflow-y: hidden; overflow-x:hidden;  max-height: 350px;">
    <div id="show_name_wrapper">
        <div style="margin-left: 20px;">
            <label style="">3 people have worked on this case:
                <br><br>- Tim Roy
                <br>- James Smith
                <br>- Merry Thomas</label>
        </div>
    </div>
</div>
<div id="provider_forward_dialog" style="overflow: scroll; overflow-x:hidden;  max-height: 300px;">
    <div id="provider_forward_wrapper">

        <div style="margin-left: 20px;">
            <label style="font-weight: bold;">Forward Claim(s):</label>
        </div>

    </div>
</div>

<div id="workspace_add_claims_dialog" style="overflow: scroll; overflow-x:hidden;  max-height: 300px;">
    <label>{workspace_add_claims_dialog_label}</label>
    <table id="workspace_add_claims_dialog_table">

    </table>
</div>


<div id="create_case_dialog" class="outerdiv" align="center">
    <div class="createcase-container" align="left" id="createcase-container" >
        <div class="create-case-header" id="create-case-header" >
            <span class="header-text" >{create_case_dialog_create_case_label}</span>
        </div>

        <div class="type-of-fraud" id="type-of-fraud">
            <div class="fraud-type-title" >{create_case_dialog_type_fraud_provider}</div>
            <div class="fraud-case-source">
                <div class="case-source-system">
                    <span class="case-source-title" >{create_case_dialog_case_source}</span> 
                    <input type="radio" name="case-source" value="System" checked>{create_case_dialog_case_source_value1}</input>
                    <input type="radio" name="case-source" value="Hotline">{create_case_dialog_case_source_value2}</input>
                    <input type="radio" name="case-source" value="OtherUsers">{create_case_dialog_case_source_value3}</input>
                </div>
            </div>
        </div>
        <div class="fraud-risk-reason" id="fraud-risk-reason" >
            <div class="fraud-type-title" >{fraud_risk_reason_select_reason_label}</div>
            <table width="100%" id="fraud-risk-table">
                <tbody>
                    <tr>
                        <td><input type="checkbox" name="createcase-reason"/>{fraud_risk_reason_value1}</td>
                        <td><input type="checkbox" name="createcase-reason" checked/>Specialty - Procedure Mismatch</td>
                        <td><input type="checkbox" name="createcase-reason"/>{fraud_risk_reason_value3}</td>

                    </tr>
                    <tr>
                        <td><input type="checkbox" name="createcase-reason"/>{fraud_risk_reason_value4}</td>
                        <td><input type="checkbox" name="createcase-reason"/>{fraud_risk_reason_value5}</td>
                        <td><input type="checkbox" name="createcase-reason"/>{fraud_risk_reason_value6}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="fraud-review-div" >
            <div class="nextreviewdate"><span class="fraud-review-date" >{fraud_risk_reason_next_review}</span> <input type="text" readonly value="01-07-2014" name="next-review-date"/></div>
        </div>
        <div class="fraud-review-comment-div" >
            <textarea  name="createcase-fraud-review" class="createcase-fraud-review">{fraud_risk_reason_comment}</textarea>
        </div>
        <div id="createcase-footer" class="createcase-footer" >
            <div class="right-content" >
                <button class="analysis_header_buttons" type="button" id="case-button-save">{fraud_risk_reason_submit}</button>
                <span class="button-space" style="width:8px;">&nbsp;</span>
                <button class="analysis_header_buttons" type="button" id="case-button-cancel">{fraud_risk_reason_cancel}</button>
            </div>
        </div>
    </div>
</div>



<div id="release_provider_dialog" class="outerdiv" align="center">
    <div class="releasecase-container" align="left" id="releasecase-container" >
        <div class="release-case-header" id="release-case-header" >
            <span class="header-text" style="font-family:Arial;font-size:16px;font-weight:bold;">{fraud_risk_reason_release_provider}</span>
        </div>

        <div class="release-provider-reason" id="release-provider-reason" >
            <div class="release-provider-type-title" style="margin-bottom:20px;">{fraud_risk_reason_select_reason}</div>
            <table width="100%" id="release-provider-table">
                <tbody>
                    <tr >
                        <td><input type="checkbox" name="releaseprovider-reason"/>{fraud_risk_reason_select_row1_value1}</td>
                        <td><input type="checkbox" name="releaseprovider-reason"/>{fraud_risk_reason_select_row1_value2}</td>
                        <td><input type="checkbox" name="releaseprovider-reason"/>{fraud_risk_reason_select_row1_value3}</td>
                    </tr>
                    <tr style="height:30px;">
                        <td><input type="checkbox" name="releaseprovider-reason"/>{fraud_risk_reason_select_row2_value1}</td>
                        <td><input type="checkbox" name="releaseprovider-reason"/>{fraud_risk_reason_select_row2_value2}</td>
                        <td><input type="checkbox" name="releaseprovider-reason"/>{fraud_risk_reason_select_row2_value3}</td>
                    </tr>
                    <tr style="height:30px;">
                        <td><input type="checkbox" name="releaseprovider-reason"/>{fraud_risk_reason_select_row3_value1}</td>
                        <td><input type="checkbox" name="releaseprovider-reason"/>{fraud_risk_reason_select_row3_value2}</td>
                    </tr>
                    <tr style="height:30px;">
                        <td><input type="checkbox" name="releaseprovider-reason"/>{fraud_risk_reason_select_row4_value1}</td>
                        <td><input type="checkbox" name="releaseprovider-reason"/>{fraud_risk_reason_select_row4_value2}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="release-provider-review-comment-div" >
            <textarea  name="release-provider-comment" class="release-provider-comment">{release_provider_comment_label}</textarea>
        </div>
        <div id="releasecase-footer" class="releasecase-footer" >
            <div class="right-content" >
                <button class="analysis_header_buttons" type="button" id="case-button-save">{release_provider_submit_label}</button>
                <span class="button-space" style="width:8px;">&nbsp;</span>
                <button class="analysis_header_buttons" type="button" id="case-button-cancel">{release_provider_cancel_label}</button>
            </div>
        </div>
    </div>
</div>

<div id="close_case_dialog" class="outerdiv" align="center"  >
    <div class="closecase-container" align="left" id="closecase-container" >
        <div class="release-case-header" id="release-case-header" >
            <span class="header-text" >{release_provider_close_case}</span>
        </div>

        <div class="close-case-risk-reason" id="close-case-risk-reason" >
            <div class="close-case-type-title" >{close_case_select_risk_reason}</div>
            <table width="100%" id="close-case-table">
                <tbody>
                    <tr >
                        <td><input type="checkbox" name="closecase-reason" checked/>{close_case_select_risk_reason_value1}</td>
                        <td><input type="checkbox" name="closecase-reason"/>{close_case_select_risk_reason_value2}</td>
                        <td><input type="checkbox" name="closecase-reason"/>{close_case_select_risk_reason_value3}</td>
                        <td><input type="checkbox" name="closecase-reason"/>{close_case_select_risk_reason_value4}</td>
                        <td><input type="checkbox" name="closecase-reason"/>{close_case_select_risk_reason_value5}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="close-case-review-comment-div" >
            <textarea  class="close-case-comment" name="close-case-comment">{release_provider_comment_label}</textarea>
        </div>
        <div id="closecase-footer" class="closecase-footer" >
            <div class="right-content" >
                <button class="analysis_header_buttons" type="button" id="case-button-save">{release_provider_submit_label}</button>
                <span class="button-space" style="width:8px;">&nbsp;</span>
                <button class="analysis_header_buttons" type="button" id="case-button-cancel">{release_provider_cancel_label}</button>
            </div>
        </div>
    </div>
</div>


<!-- forward share case dialog start  -->

<div id="forward_share_case_dialogue" style="display:none;">

	<div id="forward_share_case_wrapper">
				
        <div class="add_user_row">
	        <select class="forward_share_case_list" id="forward_share_name_list" style="float:left">
	        	<option value="Adam">Adam</option>
	        	<option value="John">John</option>
	        	<option value="Chris">Chris</option>
			</select>
	        <select class="forward_share_case_list" id="forward_share_access_list" style="float:left">
			</select>
		</div>
    </div>

</div>

<!-- forward share case dialog end  -->
