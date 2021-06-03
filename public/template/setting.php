<?php require_once 'header.php'; ?>
<div class="pace-container">
    <!-- START HEADER-->
    <header class="pace-header">
        <nav class="navbar navbar-expand-lg js-pace-navbar">
            <a class="navbar-brand" href="" target="_blank"><svg style="position:relative;height:.7em;transform:translateY(25%);margin: 0 5px;" viewBox="0 0 153 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg" display="inline-block"><path d="M147.6 30.5a6 6 0 10-2.8-11.5 6 6 0 002.8 11.5zM122.5.1c-8.2 0-15 6.9-15 15.4 0 8.4 6.8 15.3 15 15.3 7.1 0 11.8-5 13.4-8.4a4.3 4.3 0 00-4.8.4 8.2 8.2 0 01-5.2 1.7 9.3 9.3 0 01-9.7-8.3l-.1-1.5h20.3v-.8c0-7.8-6.2-13.8-13.9-13.8zm-6.2 10.5c.7-3.4 2.4-6 5.5-6 3.5 0 5.5 3.3 6.2 6h-11.7zM97 22.8a9.3 9.3 0 01-5 1.5c-5.8 0-8.8-5-8.8-10.1 0-5.8 3.3-9.9 7.7-9.9 2.4 0 4 1 5.2 2.5 1 1.5 1.7 3.5 2.2 5.9h3.3V.5C97 1.6 95.3 0 89.5 0c-8 0-14.8 6.9-14.8 15.4 0 8.4 6 15.3 15.4 15.3 7.2 0 11.7-6.7 12.7-10l-2.7-1.2c-.8 1.3-1.9 2.4-3.1 3.2zM69.9 26.2l-2.7-1.9V11.6C67.2 2 59.6 0 55.2 0c-5.3 0-7 1.2-13.3.6v10.8H44c4 0 3.6-7.2 9.2-7.2 4.2 0 5.6 2.8 5.6 6.7v.2l-8.7 1.5C43.8 14 39.9 17 39.9 22.6c0 4.8 4.2 8.2 9.9 8.2 5 0 8.5-2.9 10.6-7.7a2.7 2.7 0 011.3 3.1l-1.2 4.2H72a5.1 5.1 0 00-2.1-4.2zm-17.6-.5c-2.3 0-3.8-1.8-3.9-4A5.6 5.6 0 0153 16c2.2-.5 4.3-1 6-1.2 0 8.8-4 10.8-6.6 10.8zM21.8 0c-4.6 0-7.8 3.1-9.4 7.8A3 3 0 0111 4.5l1-4.2H0a4.9 4.9 0 002.3 4.2l2.9 1.8V28A11 11 0 010 37.3V40h18.7a4.8 4.8 0 00-2.3-4l-3-1.9V25c1.9 3.4 4.9 5.8 9 5.8 7 0 12.7-6.9 12.7-15.4C35.1 7 29.1 0 21.8 0zm-1.2 26.3c-4 0-6.4-5-6.7-9.6-.3-4.6.9-11.1 5.6-11.1 5.1 0 6.6 5.9 7 10 .3 4.1-.6 10.7-6 10.7z"></path></svg></a>
            <sub class="heading-primary"><?=__('Spread your purchases into interest-free instalments.', 'pace-easystore');?></sub>
        </nav>
    </header>
    <!-- CLOSE HEADER-->
    <!-- START CONTENT-->
    <main class="pace-content">
        <div class="pace-styleguide">
            <div class="container pace-user-form-section">
                <section>
                    <form method="POST">
                        <section class="enable-setting">
                            <div class="row mb-3">
                                <label for="colFormLabelSm" class="col-sm-3 col-form-label col-form-label-sm">Enable</label>
                                <div class="col-sm-9">
                                    <label class="pace-custom-switcher">
                                        <input type="hidden" name="enable" value="0">
                                        <input type="checkbox" name="enable" <?php echo (isset($shopSetting['enable']) && $shopSetting['enable'] == 'on') ? 'checked' : ''; ?> onClick="this.previousSibling.value=1-this.previousSibling.value"><span class="pace-custom-switcher__slider"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="colFormLabelSm" class="col-sm-3 col-form-label col-form-label-sm">Enable Playground</label>
                                <div class="col-sm-9">
                                    <label class="pace-custom-switcher">
                                        <input type="hidden" name="enable_playground" value="0">
                                        <input type="checkbox" name="enable_playground" <?php echo (isset($shopSetting['enable_playground']) && $shopSetting['enable_playground'] == 'on') ? 'checked' : ''; ?> onClick="this.previousSibling.value=1-this.previousSibling.value"><span class="pace-custom-switcher__slider"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="colFormLabelSm" class="col-sm-3 col-form-label col-form-label-sm">Pay with Pace mode</label>
                                <div class="col-sm-5">
                                    <div class="ginput_container ginput_container_select">
                                        <select name="payment_mode">
                                            <?php $paymentMode = array('redirect', 'popup');foreach ($paymentMode as $value) {?>
                                                <option value="<?=$value;?>" <?php echo isset($shopSetting['payment_mode']) && $shopSetting['payment_mode'] == $value ? 'selected' : ''; ?>><?=ucfirst($value);?></option>
                                            <?php }?>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="apps.title" class="col-sm-3 col-form-label col-form-label-sm">Title</label>
                                <div class="col-sm-5">
                                    <input class="pace-form-control" name="title" type="text" id="apps.title" value="<?php echo $shopSetting['title'] ?? ''; ?>">
                                </div>
                            </div>
                        </section>
                        <section class="api-setting">
                            <h2 class="heading-primary">API Credentials</h2>
                            <sub><?=__('You must be a Pace registered merchant to get these credentials. Please contact merchant-integration@pacenow.co if you need help retrieving these details.', 'pace-easystore');?></sub>
                            <div class="api-setting-fields pt-4">
                                <div class="row mb-3">
                                    <label for="client_id" class="col-sm-3 col-form-label col-form-label-sm">Client ID</label>
                                    <div class="col-sm-5">
                                        <input class="pace-form-control" name="pace_client_id" type="text" id="client_id" value="<?php echo $shopSetting['pace_client_id'] ?? ''; ?>">
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="client_secret" class="col-sm-3 col-form-label col-form-label-sm">Client Secret</label>
                                    <div class="col-sm-5">
                                        <input class="pace-form-control" name="pace_client_secret" type="text" id="client_secret" value="<?php echo $shopSetting['pace_client_secret'] ?? ''; ?>">
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="playground_client_id" class="col-sm-3 col-form-label col-form-label-sm">Playground Client ID</label>
                                    <div class="col-sm-5">
                                        <input class="pace-form-control" name="playground_client_id" type="text" id="playground_client_id" value="<?php echo $shopSetting['playground_client_id'] ?? ''; ?>">
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="playground_client_secret" class="col-sm-3 col-form-label col-form-label-sm">Playground Client Secret</label>
                                    <div class="col-sm-5">
                                        <input class="pace-form-control" name="playground_client_secret" type="text" id="playground_client_secret" value="<?php echo $shopSetting['playground_client_secret'] ?? ''; ?>">
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section>
                            <button type="submit" value="Submit" class="pace-btn pace-btn-outline-primary">Save</button>
                        </section>
                    </form>
                </section>
            </div>
        </div>
    </main>
    <?php require_once 'footer.php'; ?>
</div>