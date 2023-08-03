exports.verifyAccountText = (user, verification) => {
	const text = `<div>
    <h2>Cher ${user.userName}</h2>
    <p>Nous sommes ravis que vous ayez choisi de vous inscrire sur notre plateforme ! Avant de commencer à profiter pleinement de nos services, nous devons vérifier votre adresse e-mail pour des raisons de sécurité.</p>
    <p>Veuillez cliquer sur le lien ci-dessous pour confirmer votre adresse e-mail et activer votre compte : </p>

    <span>${verification}</span>
    
    <p>Nous vous remercions de votre confiance envers notre service et sommes impatients de vous accompagner dans votre parcours avec nous.</p>
    <br />
    Cordialement,
    L'équipe de Arya
</div>`;

	return text;
};

exports.resetEmailText = (user, verification) => {
	const text = `<div>
    <h2>Cher ${user.userName}</h2>
    <p>Vous avez récemment demandé à changer votre adresse e-mail associée à votre compte ${user.userName}.</p>
    <p>Veuillez confirmer ce changement en cliquant sur le lien de confirmation ci-dessous :</p>

    <span>${verification}</span>

    <p>Ce lien de confirmation est unique pour votre compte et ne sera valide que pour une durée limitée, veuillez le cliquer dès que possible pour compléter le processus de changement d'adresse e-mail.</p>
    <p>Si vous n'avez pas initié ce changement ou si vous pensez qu'il s'agit d'une erreur, veuillez ignorer cet e-mail et votre adresse e-mail actuelle restera inchangée.</p>

    <br />
    Cordialement, L'équipe de Arya
</div>`;

	return text;
};

exports.resetPasswordText = (user, verification) => {
	const text = `<div>
    <h2>Cher/Chère ${user.lastName}</h2>
    <p>Nous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte ${user.userName} associé à cette adresse e-mail.</p>
    <p>Si vous avez effectué cette demande, veuillez copier le code ci-dessous pour réinitialiser votre mot de passe : </p>

    <span style="font-size: 25px; font-weight: bold;">${verification}</span>

    <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail. Votre compte reste sécurisé, et aucun changement n'a été apporté à votre mot de passe.</p>
    <br />
    Cordialement,
    L'équipe de Arya
    </div>`;

	return text;
};
