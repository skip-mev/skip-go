export default function SkipGoChainForm() {
  const [isPreLaunch, setIsPreLaunch] = React.useState(false);
  const [chainRegistryUrl, setChainRegistryUrl] = React.useState('https://github.com/cosmos/chain-registry/tree/master/');
  const [projectName, setProjectName] = React.useState('');
  const [developmentStage, setDevelopmentStage] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');
  const [projectWebsite, setProjectWebsite] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [rpcEndpoint, setRpcEndpoint] = React.useState('');
  const [grpcEndpoint, setGrpcEndpoint] = React.useState('');
  const [restEndpoint, setRestEndpoint] = React.useState('');
  const [evmEndpoint, setEvmEndpoint] = React.useState('');
  const [useSlack, setUseSlack] = React.useState(false);
  const [slackInfo, setSlackInfo] = React.useState('');
  const [useTelegram, setUseTelegram] = React.useState(false);
  const [telegramHandle, setTelegramHandle] = React.useState('');
  const [isValidating, setIsValidating] = React.useState(false);
  const [chainData, setChainData] = React.useState(null);
  const [validationErrors, setValidationErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState('');

  const validateEndpoint = (url) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateChainRegistry = async () => {
    if (!chainRegistryUrl || !chainRegistryUrl.trim()) {
      setChainData(null);
      return;
    }

    setIsValidating(true);
    setChainData(null);

    try {
      // Handle various GitHub URL formats
      const match = chainRegistryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/(?:tree|blob)\/[^\/]+)?\/([^\/\?]+)/);
      if (!match) {
        setValidationErrors({ chainRegistry: 'Invalid GitHub URL format. Please provide a valid Chain Registry GitHub URL.' });
        setIsValidating(false);
        return;
      }

      const owner = match[1];
      const repo = match[2];
      const chainName = match[3];

      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${chainName}/chain.json`;

      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3.raw'
        }
      });

      if (!response.ok) {
        setValidationErrors({ chainRegistry: 'Chain not found in registry' });
        setIsValidating(false);
        return;
      }

      const content = await response.json();

      setChainData({
        chain_id: content.chain_id,
        chain_name: content.chain_name,
        pretty_name: content.pretty_name || content.chain_name,
        network_type: content.network_type || 'mainnet'
      });

      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.chainRegistry;
        return newErrors;
      });

    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setValidationErrors({ chainRegistry: 'Network error. Please check your connection and try again.' });
      } else {
        setValidationErrors({ chainRegistry: 'Failed to validate chain registry URL. Please check the URL and try again.' });
      }
    }

    setIsValidating(false);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      validateChainRegistry();
    }, 500);
    return () => clearTimeout(timer);
  }, [chainRegistryUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (isPreLaunch) {
      // Pre-launch validation - only require basic info
      if (!projectName.trim()) errors.projectName = 'Project name is required';
      if (!developmentStage) errors.developmentStage = 'Please select a development stage';
      if (!contactEmail.trim()) errors.contactEmail = 'Contact email is required';
      // Validate communication preferences if checked
      if (useSlack && !slackInfo.trim()) errors.slackInfo = 'Please provide Slack workspace or channel';
      if (useTelegram && !telegramHandle.trim()) errors.telegramHandle = 'Please provide Telegram handle';
    } else {
      // Post-launch validation - full requirements
      if (!validateEndpoint(rpcEndpoint)) errors.rpc = true;
      if (!validateEndpoint(grpcEndpoint)) errors.grpc = true;
      if (!validateEndpoint(restEndpoint)) errors.rest = true;
      if (evmEndpoint && !validateEndpoint(evmEndpoint)) errors.evm = true;
      if (!chainData) errors.chainRegistry = 'Please provide a valid chain registry URL';
      if (!contactEmail.trim()) errors.contactEmail = 'Contact email is required';
      // Validate communication preferences if checked
      if (useSlack && !slackInfo.trim()) errors.slackInfo = 'Please provide Slack workspace or channel';
      if (useTelegram && !telegramHandle.trim()) errors.telegramHandle = 'Please provide Telegram handle';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmitMessage('Please fix validation errors before submitting');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    let messageBody;
    if (isPreLaunch) {
      messageBody = `
Pre-Launch Chain Integration Interest

Project: ${projectName}
Development Stage: ${developmentStage}
Description: ${projectDescription || 'Not provided'}
Website: ${projectWebsite || 'Not provided'}

Contact: ${contactEmail}
Communication Preferences:
${useSlack && slackInfo ? `- Slack: ${slackInfo}` : ''}
${useTelegram && telegramHandle ? `- Telegram: ${telegramHandle}` : ''}
      `.trim();
    } else {
      messageBody = `
Chain Integration Request

Chain Registry: ${chainRegistryUrl}
Chain Name: ${chainData.pretty_name}
Chain ID: ${chainData.chain_id}

Required Endpoints:
- RPC: ${rpcEndpoint}
- gRPC: ${grpcEndpoint}
- REST: ${restEndpoint}
${evmEndpoint ? `- EVM: ${evmEndpoint}` : ''}

Contact: ${contactEmail}
Communication Preferences:
${useSlack && slackInfo ? `- Slack: ${slackInfo}` : ''}
${useTelegram && telegramHandle ? `- Telegram: ${telegramHandle}` : ''}
      `.trim();
    }

    // Use simple URL-encoded string exactly like curl
    const encodedData = `email=${encodeURIComponent(contactEmail.trim())}&message=${encodeURIComponent(messageBody)}`;

    try {
      const response = await fetch('https://formspree.io/f/xzzjbrgn', {
        method: 'POST',
        body: encodedData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const responseData = await response.text();

      if (response.ok) {
        // Formspree returns {ok: true} on success
        try {
          const data = JSON.parse(responseData);
          if (data.ok) {
            // Clear form and show success message
            setIsPreLaunch(false);
            setChainRegistryUrl('');
            setProjectName('');
            setDevelopmentStage('');
            setProjectDescription('');
            setProjectWebsite('');
            setContactEmail('');
            setRpcEndpoint('');
            setGrpcEndpoint('');
            setRestEndpoint('');
            setEvmEndpoint('');
            setUseSlack(false);
            setSlackInfo('');
            setUseTelegram(false);
            setTelegramHandle('');
            setChainData(null);
            setIsSubmitting(false);
            setSubmitMessage('Thank you! Your integration request has been submitted. Our Customer Success Engineering team will review it shortly.');
            return;
          }
        } catch (e) {
          setSubmitMessage('Submission received. Our team will review your request.');
        }
      } else if (response.status === 422) {
        // Validation error from Formspree
        try {
          const errorData = JSON.parse(responseData);
          if (errorData.errors && errorData.errors.length > 0) {
            const errorMessages = errorData.errors.map(err => err.message).join(', ');
            setSubmitMessage(`Validation error: ${errorMessages}. Please check your email address.`);
          } else {
            setSubmitMessage('Please enter a valid email address.');
          }
        } catch (e) {
          setSubmitMessage('Please enter a valid email address.');
        }
      } else {
        setSubmitMessage(`Failed to submit request (Error ${response.status}). Please try again or contact us on our Interchain Discord if the issue persists.`);
      }
    } catch (error) {
      setSubmitMessage('Network error occurred. Please try again or contact us on our Interchain Discord if the issue persists.');
    }

    setIsSubmitting(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border-color, #e2e8f0)',
    backgroundColor: 'var(--background-secondary, transparent)',
    color: 'var(--text-primary, inherit)',
    fontSize: '14px',
    fontFamily: 'inherit'
  };

  const getInputStyle = (field) => {
    const style = { ...inputStyle };
    if (field === 'rpc' && rpcEndpoint) {
      style.borderColor = validateEndpoint(rpcEndpoint) ? '#10b981' : '#ef4444';
    }
    if (field === 'grpc' && grpcEndpoint) {
      style.borderColor = validateEndpoint(grpcEndpoint) ? '#10b981' : '#ef4444';
    }
    if (field === 'rest' && restEndpoint) {
      style.borderColor = validateEndpoint(restEndpoint) ? '#10b981' : '#ef4444';
    }
    if (field === 'evm' && evmEndpoint) {
      style.borderColor = validateEndpoint(evmEndpoint) ? '#10b981' : '#ef4444';
    }
    return style;
  };

  return (
    <div style={{ margin: '20px 0' }}>
      {/* Important disclaimer */}
      <div style={{
        padding: '16px',
        backgroundColor: 'var(--background-warning, rgba(251, 191, 36, 0.1))',
        border: '1px solid var(--border-warning, rgba(251, 191, 36, 0.3))',
        borderRadius: '8px',
        marginBottom: '24px',
        color: 'var(--text-primary, inherit)'
      }}>
        <strong style={{ color: 'var(--text-warning, #f59e0b)' }}>Important:</strong> Cosmos Labs reserves the right to remove support for any chain that becomes a burden to maintain, including but not limited to chains with unstable infrastructure, frequent breaking changes, or insufficient ecosystem activity.
      </div>

      {/* Looking for something else? */}
      <div style={{
        marginBottom: '24px',
        padding: '12px',
        backgroundColor: 'var(--background-secondary, #f8f9fa)',
        border: '1px solid var(--border-color, #e2e8f0)',
        borderRadius: '6px',
        fontSize: '14px',
        color: 'var(--text-primary, inherit)'
      }}>
        Looking for something else? Contact the team through the{' '}
        <a
          href="https://cosmos.network/interest-form"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--link-color, #3b82f6)', textDecoration: 'underline' }}
        >
          Cosmos Network interest form
        </a>.
      </div>

      {/* Pre-launch checkbox */}
      <div style={{
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: 'var(--background-secondary, rgba(59, 130, 246, 0.05))',
        border: '2px solid var(--link-color, #3b82f6)',
        borderRadius: '8px'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          color: 'var(--text-primary, inherit)'
        }}>
          <input
            type="checkbox"
            checked={isPreLaunch}
            onChange={(e) => {
              setIsPreLaunch(e.target.checked);
              setValidationErrors({});
              setSubmitMessage('');
              // Clear chain data when switching modes
              if (e.target.checked) {
                setChainData(null);
                setChainRegistryUrl('');
              }
            }}
            style={{
              width: '20px',
              height: '20px',
              cursor: 'pointer'
            }}
          />
          <div>
            <div style={{ marginBottom: '4px' }}>
              My chain is pre-launch / in development
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '400',
              color: 'var(--text-secondary, #64748b)'
            }}>
              Check this if your chain is not yet live on mainnet or not in the Chain Registry
            </div>
          </div>
        </label>
      </div>

      {/* Requirements section - show different requirements based on pre-launch state */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary, inherit)' }}>
          Requirements
        </h3>
        {isPreLaunch ? (
          <>
            <p style={{ marginBottom: '8px', color: 'var(--text-primary, inherit)' }}>
              For pre-launch chains, we focus on establishing communication:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '16px', color: 'var(--text-primary, inherit)' }}>
              <li><strong>Project Information:</strong> Name and development stage</li>
              <li><strong>Contact Details:</strong> Valid email for establishing communication</li>
              <li><strong>Communication Preferences:</strong> Slack, Telegram, or other preferred channels</li>
              <li><strong>Endpoints (Optional):</strong> If available, provide your test endpoints</li>
            </ul>
          </>
        ) : (
          <>
            <p style={{ marginBottom: '8px', color: 'var(--text-primary, inherit)' }}>
              Before submitting this form, ensure you have:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '16px', color: 'var(--text-primary, inherit)' }}>
              <li><strong>Chain Registry Listing:</strong> Your chain must be listed in the official Cosmos Chain Registry</li>
              <li><strong>Dedicated Endpoints:</strong> Non-rate-limited RPC, gRPC, and REST endpoints</li>
              <li><strong>Stable Infrastructure:</strong> Endpoints must maintain high availability</li>
              <li><strong>Technical Contact:</strong> Valid email for integration support</li>
            </ul>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>

        {/* Honeypot field for spam prevention */}
        <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />

        {/* Conditional fields based on pre-launch status */}
        {isPreLaunch ? (
          <>
            {/* Pre-launch fields */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Project/Chain Name *
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter your project or chain name"
                required
                style={inputStyle}
              />
              {validationErrors.projectName && (
                <div style={{ marginTop: '6px', color: '#ef4444', fontSize: '13px' }}>
                  {validationErrors.projectName}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Development Stage *
              </label>
              <select
                value={developmentStage}
                onChange={(e) => setDevelopmentStage(e.target.value)}
                required
                style={inputStyle}
              >
                <option value="">Select stage...</option>
                <option value="Planning">Planning / Research</option>
                <option value="Development">Active Development</option>
                <option value="Testnet">Testnet Live</option>
              </select>
              {validationErrors.developmentStage && (
                <div style={{ marginTop: '6px', color: '#ef4444', fontSize: '13px' }}>
                  {validationErrors.developmentStage}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Project Description
              </label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Brief description of your project..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Project Website
              </label>
              <input
                type="url"
                value={projectWebsite}
                onChange={(e) => setProjectWebsite(e.target.value)}
                placeholder="https://yourproject.com"
                style={inputStyle}
              />
            </div>
          </>
        ) : (
          <>
            {/* Post-launch fields */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Chain Registry URL *
              </label>
              <input
                type="url"
                value={chainRegistryUrl}
                onChange={(e) => setChainRegistryUrl(e.target.value)}
                placeholder="https://github.com/cosmos/chain-registry/tree/master/osmosis"
                required
                style={inputStyle}
              />
              <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--muted-text, #64748b)' }}>
                Your chain must be listed in the{' '}
                <a
                  href="https://github.com/cosmos/chain-registry?tab=readme-ov-file#contributing"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--link-color, #3b82f6)', textDecoration: 'underline' }}
                >
                  Cosmos Chain Registry
                </a>
              </div>
              {isValidating && (
                <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--muted-text, #64748b)' }}>
                  Validating chain...
                </div>
              )}
              {chainData && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--success-bg, #f0fdf4)',
                  border: '1px solid var(--success-border, #86efac)',
                  fontSize: '13px'
                }}>
                  Found: {chainData.pretty_name} ({chainData.chain_id})
                </div>
              )}
              {validationErrors.chainRegistry && (
                <div style={{ marginTop: '6px', color: '#ef4444', fontSize: '13px' }}>
                  {validationErrors.chainRegistry}
                </div>
              )}
            </div>
          </>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
            Contact Email *
          </label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="your@email.com"
            required
            style={inputStyle}
          />
        </div>

        {/* Communication Preferences */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Communication Preferences
          </h3>
          <p style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-secondary, #64748b)' }}>
            How would you prefer we communicate with you during the integration process?
          </p>

          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: 'var(--success-bg, rgba(34, 197, 94, 0.05))',
            border: '1px solid var(--success-border, #86efac)',
            borderRadius: '6px'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              <input
                type="checkbox"
                checked={useSlack}
                onChange={(e) => setUseSlack(e.target.checked)}
              />
              Slack (Strongly Preferred - we'll invite you to a shared channel)
            </label>
            {useSlack && (
              <>
                <input
                  type="text"
                  value={slackInfo}
                  onChange={(e) => setSlackInfo(e.target.value)}
                  placeholder="Your Slack email or workspace name"
                  style={{ ...inputStyle, marginTop: '8px', marginLeft: '24px', width: 'calc(100% - 24px)' }}
                />
                {validationErrors.slackInfo && (
                  <div style={{ marginTop: '6px', marginLeft: '24px', color: '#ef4444', fontSize: '13px' }}>
                    {validationErrors.slackInfo}
                  </div>
                )}
              </>
            )}
            <div style={{ marginTop: '8px', marginLeft: '24px', fontSize: '12px', color: 'var(--text-secondary, #64748b)', fontStyle: 'italic' }}>
              Slack is typically more active during business hours, in addition we have some shared public channels available.
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={useTelegram}
                onChange={(e) => setUseTelegram(e.target.checked)}
              />
              Telegram
            </label>
            {useTelegram && (
              <>
                <input
                  type="text"
                  value={telegramHandle}
                  onChange={(e) => setTelegramHandle(e.target.value)}
                  placeholder="@your_telegram_handle"
                  style={{ ...inputStyle, marginTop: '8px', marginLeft: '24px', width: 'calc(100% - 24px)' }}
                />
                {validationErrors.telegramHandle && (
                  <div style={{ marginTop: '6px', marginLeft: '24px', color: '#ef4444', fontSize: '13px' }}>
                    {validationErrors.telegramHandle}
                  </div>
                )}
              </>
            )}
          </div>

        </div>

        {/* Only show endpoints section for post-launch chains */}
        {!isPreLaunch && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                Required Endpoints
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                  RPC Endpoint *
                </label>
                <input
                  type="url"
                  value={rpcEndpoint}
                  onChange={(e) => setRpcEndpoint(e.target.value)}
                  placeholder="https://rpc.yourchain.com"
                  required
                  style={getInputStyle('rpc')}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                  gRPC Endpoint (with port) *
                </label>
                <input
                  type="url"
                  value={grpcEndpoint}
                  onChange={(e) => setGrpcEndpoint(e.target.value)}
                  placeholder="grpc.yourchain.com:443"
                  required
                  style={getInputStyle('grpc')}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                  REST API Endpoint *
                </label>
                <input
                  type="url"
                  value={restEndpoint}
                  onChange={(e) => setRestEndpoint(e.target.value)}
                  placeholder="https://rest.yourchain.com"
                  required
                  style={getInputStyle('rest')}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                Optional Endpoints
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                  EVM JSON-RPC Endpoint
                </label>
                <input
                  type="url"
                  value={evmEndpoint}
                  onChange={(e) => setEvmEndpoint(e.target.value)}
                  placeholder="https://evm.yourchain.com"
                  style={getInputStyle('evm')}
                />
                <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--muted-text, #64748b)' }}>
                  Only if your chain supports EVM
                </div>
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isSubmitting || (!isPreLaunch && !chainData)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: ((!isPreLaunch && !chainData) || isSubmitting)
              ? 'var(--muted-text, #64748b)'
              : 'var(--link-color, #3b82f6)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: ((!isPreLaunch && !chainData) || isSubmitting) ? 'not-allowed' : 'pointer',
            opacity: ((!isPreLaunch && !chainData) || isSubmitting) ? 0.5 : 1,
            transition: 'all 0.2s'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Integration Request'}
        </button>

        {submitMessage && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '6px',
            backgroundColor: submitMessage.includes('Thank you')
              ? 'var(--success-bg, #f0fdf4)'
              : 'var(--error-bg, #fef2f2)',
            border: submitMessage.includes('Thank you')
              ? '1px solid var(--success-border, #86efac)'
              : '1px solid var(--error-border, #fca5a5)',
            color: submitMessage.includes('Thank you')
              ? 'var(--success-text, #166534)'
              : 'var(--error-text, #991b1b)',
            fontSize: '14px'
          }}>
            {submitMessage}
          </div>
        )}
      </form>

      {/* What Happens Next section */}
      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color, #e2e8f0)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary, inherit)' }}>
          What Happens Next?
        </h3>
        <p style={{ marginBottom: '12px', color: 'var(--text-primary, inherit)' }}>
          After submitting this form:
        </p>
        <ol style={{ marginLeft: '20px', color: 'var(--text-primary, inherit)' }}>
          <li>Our team will review your request within 2-3 business days</li>
          <li>We'll validate your endpoints and chain configuration</li>
          <li>If approved, your chain will be added to Skip API</li>
          <li>You'll receive confirmation via the contact email provided</li>
        </ol>
        <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-muted, #64748b)' }}>
          For questions or support, please open a ticket in our{' '}
          <a
            href="https://discord.gg/interchain"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--link-color, #3b82f6)', textDecoration: 'underline' }}
          >
            Discord
          </a>.
        </p>
      </div>
    </div>
  );
}