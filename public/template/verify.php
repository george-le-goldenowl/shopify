<?php require_once 'header.php'; ?>
<div class="pace-container">
	<!-- START CONTENT-->
    <main class="pace-content">
        <div class="woocommerce">
            <section class="pace-user-form-section pace-user-form-section--login">
                <div class="pace-user-form-section__container">
                    <form id="shopify-verify">
                        <div class="pace-user-form">
                            <div class="pace-user-form__header">
                                <h2 class="pace-user-form__title">Shopify Partner</h2>
                                <sub>Please enter Client Id and secret to verify custom apps.</sub>
                            </div>
                            <div class="pace-user-form__body">
                            	<input type="hidden" name="csrf" value="<?php echo wp_create_nonce('shopify_verify'); ?>">
                            	<div class="pace-form-group">
                            		<label class="pace-form-label">Shopify URL: <strong><?php echo untrailingslashit( $_GET['shop'] ); ?></strong></label>
                            	</div>
                                <div class="pace-form-group">
                                    <label class="pace-form-label" for="client-id">Client Id</label>
                                    <input class="pace-form-control" name="client_id" type="text" id="client-id" placeholder="Apps Id"/>
                                </div>
                                <div class="pace-form-group">
                                    <label class="pace-form-label" for="client-secret">Client Secret</label>
                                    <input class="pace-form-control" name="client_secret" type="text" id="client-secret" placeholder="Apps secret"/>
                                </div>
                                <div class="pace-form-group">
                                    <button class="ec-btn ec-btn-primary">Verification</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    </main>
    <!-- CLOSE CONTENT-->
    <?php require_once 'footer.php'; ?>
    <script type="text/javascript">"use strict";var form=$("#shopify-verify");form.on("submit",function(e){e.preventDefault(),form.prop("disabled",!0),form.find("button").addClass("is-loading"),$.post(window.location.href,form.serialize(),function(e,o,t){var s='<h2 class="ven-checkout-success__title text-center">'+e.data.message+"</h2>";form.find(".pace-user-form__body").html(s)})});</script>
</div>