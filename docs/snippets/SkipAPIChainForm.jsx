export default function SkipAPIChainForm() {
  const [chainRegistryUrl, setChainRegistryUrl] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [rpcEndpoint, setRpcEndpoint] = React.useState('');
  const [grpcEndpoint, setGrpcEndpoint] = React.useState('');
  const [restEndpoint, setRestEndpoint] = React.useState('');
  const [evmEndpoint, setEvmEndpoint] = React.useState('');
  const [acceptTerms, setAcceptTerms] = React.useState(false);
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
    if (!chainRegistryUrl) {
      setChainData(null);
      return;
    }

    setIsValidating(true);
    setChainData(null);

    try {
      const match = chainRegistryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/[^\/]+)?\/([^\/]+)$/);
      if (!match) {
        setValidationErrors({ chainRegistry: 'Invalid GitHub URL format' });
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
      setValidationErrors({ chainRegistry: 'Failed to validate chain registry URL' });
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
    if (!validateEndpoint(rpcEndpoint)) errors.rpc = true;
    if (!validateEndpoint(grpcEndpoint)) errors.grpc = true;
    if (!validateEndpoint(restEndpoint)) errors.rest = true;
    if (evmEndpoint && !validateEndpoint(evmEndpoint)) errors.evm = true;
    if (!chainData) errors.chainRegistry = 'Please provide a valid chain registry URL';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmitMessage('Please fix validation errors before submitting');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    const messageBody = `
Chain Registry: ${chainRegistryUrl}
RPC Endpoint: ${rpcEndpoint}
gRPC Endpoint: ${grpcEndpoint}
REST Endpoint: ${restEndpoint}
${evmEndpoint ? `EVM Endpoint: ${evmEndpoint}` : ''}
Contact Email: ${contactEmail}
Terms Accepted: Yes
    `.trim();

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
            setChainRegistryUrl('');
            setContactEmail('');
            setRpcEndpoint('');
            setGrpcEndpoint('');
            setRestEndpoint('');
            setEvmEndpoint('');
            setAcceptTerms(false);
            setChainData(null);
            setIsSubmitting(false);
            setSubmitMessage('Thank you! Your integration request has been submitted. Our Customer Success Engineering team will review it shortly.');
            return;
          }
        } catch (e) {
          console.log('Could not parse response as JSON:', e);
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
      console.error('Form submission error:', error);
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

      {/* Requirements section */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary, inherit)' }}>
          Requirements
        </h3>
        <p style={{ marginBottom: '8px', color: 'var(--text-primary, inherit)' }}>
          Before submitting this form, ensure you have:
        </p>
        <ul style={{ marginLeft: '20px', marginBottom: '16px', color: 'var(--text-primary, inherit)' }}>
          <li><strong>Chain Registry Listing:</strong> Your chain must be listed in the official Cosmos Chain Registry</li>
          <li><strong>Dedicated Endpoints:</strong> Non-rate-limited RPC, gRPC, and REST endpoints</li>
          <li><strong>Stable Infrastructure:</strong> Endpoints must maintain high availability</li>
          <li><strong>Technical Contact:</strong> Valid email for integration support</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
            Chain Registry URL *
          </label>
          <input
            type="url"
            value={chainRegistryUrl}
            onChange={(e) => setChainRegistryUrl(e.target.value)}
            placeholder="https://github.com/cosmos/chain-registry/tree/main/osmosis"
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
              ✓ Found: {chainData.pretty_name} ({chainData.chain_id})
            </div>
          )}
          {validationErrors.chainRegistry && (
            <div style={{ marginTop: '6px', color: '#ef4444', fontSize: '13px' }}>
              {validationErrors.chainRegistry}
            </div>
          )}
        </div>

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
              gRPC Endpoint *
            </label>
            <input
              type="url"
              value={grpcEndpoint}
              onChange={(e) => setGrpcEndpoint(e.target.value)}
              placeholder="https://grpc.yourchain.com"
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

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
              style={{ marginTop: '2px' }}
            />
            <span style={{ fontSize: '14px', color: 'var(--text-color, inherit)' }}>
              I agree to the Skip API Terms of Service and understand that Cosmos Labs will review this integration request
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !acceptTerms || !chainData}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid var(--border-color, #e2e8f0)',
            backgroundColor: (!acceptTerms || !chainData || isSubmitting)
              ? 'var(--background-secondary, #f1f5f9)'
              : 'var(--primary, #3b82f6)',
            color: (!acceptTerms || !chainData || isSubmitting)
              ? 'var(--text-muted, #64748b)'
              : 'var(--primary-foreground, white)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: (!acceptTerms || !chainData || isSubmitting) ? 'not-allowed' : 'pointer',
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
          For questions or support, please contact our Customer Success Engineering team.
        </p>
      </div>
    </div>
  );
}