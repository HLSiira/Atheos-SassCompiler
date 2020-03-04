<?php
require_once('../../common.php');
?>
<label class="header"><i class="fab fa-sass"></i><?php i18n("Sass Compiler Settings"); ?></label>
<hr>
<table class="settings">
	<tr>

		<td><?php i18n("Formatter"); ?></td>
		<td>
			<select class="setting" data-setting="sass.format">
				<option value="expanded"><?php i18n("Expanded") ?></option>
				<option value="nested"><?php i18n("Nested") ?></option>
				<option value="compressed" default><?php i18n("Compressed") ?></option>
				<option value="compact"><?php i18n("Compact") ?></option>
				<option value="crunched"><?php i18n("Crunched") ?></option>
			</select>
		</td>

	</tr>
</table>